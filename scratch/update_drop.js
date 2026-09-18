const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/drops/DropDetailPage.tsx', 'utf-8');

// 1. Remove @ts-nocheck
code = code.replace('// @ts-nocheck\n', '');

// 2. Add imports
code = code.replace(
  'import { useDropById, usePlaceDropOrder } from \'@/queries/drops\';',
  'import { useDropById, usePlaceDropOrder } from \'@/queries/drops\';\nimport { useFollowCreator, useUnfollowCreator, useFollowStatus, useCreatorRatings } from \'@/queries/creators\';'
);

// 3. Add hooks for Follow and Ratings
code = code.replace(
  'const placeOrderMutation = usePlaceDropOrder();',
  `const placeOrderMutation = usePlaceDropOrder();

  const followMutation = useFollowCreator();
  const unfollowMutation = useUnfollowCreator();
  const { data: followStatus } = useFollowStatus(drop?.creator?.restaurantId);
  const { data: creatorRatings } = useCreatorRatings(drop?.creator?.restaurantId);
  const isFollowing = followStatus?.isFollowing;
  const reviews = creatorRatings?.content || [];

  const handleFollow = () => {
    if (!isAuthenticated) {
      navigate('/auth/login?redirect=/drops/' + dropId);
      return;
    }
    if (isFollowing) {
      unfollowMutation.mutate(drop!.creator!.restaurantId);
    } else {
      followMutation.mutate(drop!.creator!.restaurantId);
    }
  };`
);

// 4. Fix fake reviews array definition
code = code.replace(
  /const reviews = \[\s*\{\s*id: 1, name.*\}[\s\S]*?\];/m,
  ''
);

// 5. Fix isOrderable and isSoldOut
code = code.replace(
  'const isSoldOut = drop.status !== \'OPEN\' || drop.isSoldOut;',
  `const isSoldOut = drop.isSoldOut;
  const timeToCutoffMs = drop.minutesUntilCutoff != null 
    ? drop.minutesUntilCutoff * 60 * 1000 
    : new Date(drop.orderCutoffTime).getTime() - now.getTime();
  const isOrderable = drop.status === 'OPEN' && !isSoldOut && (drop.minutesUntilCutoff == null || drop.minutesUntilCutoff > 0);`
);
code = code.replace(
  'const timeToCutoffMs = drop.minutesUntilCutoff != null \n    ? drop.minutesUntilCutoff * 60 * 1000 \n    : new Date(drop.orderCutoffTime).getTime() - now.getTime();\n',
  ''
);

// 6. Fix quantity controls visibility
code = code.replace(
  /\{drop\.status === 'OPEN' && !isSoldOut && \(/g,
  '{isOrderable && ('
);

// 7. Fix Verification Badges
code = code.replace(
  /<ul className="space-y-2">[\s\S]*?<\/ul>/m,
  `<ul className="space-y-2">
    <li className="flex items-center gap-2 text-sm">
      <VerificationBadge level={drop.creator?.verificationLevel || 1} size="sm" />
    </li>
  </ul>`
);

// 8. Fix Bio
code = code.replace(
  '<p className="text-stone-300 leading-relaxed mb-8">This creator is passionate about bringing the best homemade food to your table.</p>',
  '<p className="text-stone-300 leading-relaxed mb-8">{drop.creator?.bio || "This creator is passionate about bringing the best homemade food to your table."}</p>'
);

// 9. Fix Follow button
code = code.replace(
  /<button className="w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">\s*Follow \{drop\.creator\?\.name\?\.split\(' '\)\[0\]\}\s*<\/button>/m,
  `<button 
    onClick={handleFollow}
    disabled={followMutation.isPending || unfollowMutation.isPending}
    className={\`w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold border-2 transition-colors \${
      isFollowing 
        ? 'border-stone-500 text-stone-500 hover:bg-stone-500 hover:text-white' 
        : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
    }\`}>
    {isFollowing ? 'Following' : \`Follow \${drop.creator?.name?.split(' ')[0] || ''}\`}
  </button>`
);

// 10. Fix Reviews Section
code = code.replace(
  /<button className="text-orange-500 font-medium text-sm hover:text-orange-600">View all →<\/button>/m,
  `<Link to={\`/creators/\${drop.creator?.restaurantId}?tab=reviews\`} className="text-orange-500 font-medium text-sm hover:text-orange-600">View all →</Link>`
);
code = code.replace(
  /<h2 className="font-display text-2xl font-bold text-stone-900">Recent Reviews<\/h2>/m,
  `<h2 className="font-display text-2xl font-bold text-stone-900">Recent Creator Reviews</h2>`
);

// Update review mapping
code = code.replace(
  /\{reviews\.map\(review => \([\s\S]*?\}\)\}/m,
  `{reviews.length === 0 ? (
    <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-2xl border border-stone-100">
      No reviews available yet.
    </div>
  ) : reviews.map((review: any) => (
    <div key={review.ratingId || review.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
            {(review.customerName || review.name || 'U').charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-stone-900">{review.customerName || review.name}</span>
        </div>
        <span className="text-xs text-stone-400">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date}</span>
      </div>
      <div className="flex gap-1 mb-2">
        {[1,2,3,4,5].map(star => (
          <Star key={star} size={14} className={star <= (review.score || review.rating) ? "fill-orange-400 text-orange-400" : "text-stone-300"} />
        ))}
      </div>
      <p className="text-sm text-stone-600">{review.reviewText || review.text}</p>
    </div>
  ))}`
);

// 11. Fix PlaceOrder Mutation type cast
code = code.replace(
  '} as unknown as Record<string, number>);',
  '});'
);

// 12. Fix Bottom Actions (Orderable, Announced, Closed)
code = code.replace(
  /\) : drop\.status === 'OPEN' && !isSoldOut \? \(/g,
  ') : isOrderable ? ('
);

code = code.replace(
  /<button className="w-full bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold rounded-xl py-4 transition-colors">\s*Notify Me When Open\s*<\/button>/m,
  `<div className="text-center">
    <button disabled className="w-full bg-stone-100 border-2 border-stone-200 text-stone-500 font-bold rounded-xl py-4 mb-2 cursor-not-allowed">
      Coming Soon
    </button>
    <p className="text-xs text-stone-500">Follow the creator to get notified of new drops.</p>
  </div>`
);

code = code.replace(
  /\{drop\.status === 'OPEN' && !isSoldOut && <span className="px-3 py-1\.5 text-sm font-bold rounded-full bg-green-500 text-white shadow-sm">🟢 Accepting Orders<\/span>\}/m,
  `{isOrderable && <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-green-500 text-white shadow-sm">🟢 Accepting Orders</span>}`
);
code = code.replace(
  /\{drop\.status === 'OPEN' && isSoldOut && <span className="px-3 py-1\.5 text-sm font-bold rounded-full bg-stone-500 text-white shadow-sm">Sold Out<\/span>\}/m,
  `{!isOrderable && drop.status === 'OPEN' && <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-stone-500 text-white shadow-sm">{isSoldOut ? 'Sold Out' : 'Order Window Closed'}</span>}`
);

fs.writeFileSync('frontend/src/pages/drops/DropDetailPage.tsx', code);
console.log('DropDetailPage updated successfully.');
