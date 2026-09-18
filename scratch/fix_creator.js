const fs = require('fs');

const path = 'frontend/src/pages/creators/CreatorProfilePage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { useParams, Link } from 'react-router-dom';",
  "import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';"
);

content = content.replace(
  /const \{ user \} = useAuthStore\(\);\s*const \[activeTab, setActiveTab\] = useState\('Drops'\);\s*const \[dropsSubFilter, setDropsSubFilter\] = useState\w*<'Active' \| 'Past'>\('Active'\);\s*const isOwner = user\?\.role === 'SELLER' && user\?\.userId === id;/,
  `const { isAuthenticated, creatorProfile } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const tabParam = searchParams.get('tab');
  const validTabs = ['drops', 'menu', 'reviews', 'reels'];
  const initialTab = (tabParam && validTabs.includes(tabParam.toLowerCase())) 
    ? tabParam.charAt(0).toUpperCase() + tabParam.slice(1).toLowerCase() 
    : 'Drops';
    
  const activeTab = initialTab;
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab: tab.toLowerCase() });
  };
  
  const isOwner = isAuthenticated && creatorProfile?.restaurantId === id;`
);

content = content.replace(
  "const { data: isFollowing } = useFollowStatus(user ? id : undefined);",
  "const { data: followStatusData } = useFollowStatus(isAuthenticated && !isOwner ? id : undefined);\n  const isFollowing = !!followStatusData;"
);

content = content.replace(
  /const handleFollowToggle = \(\) => \{\s*if \(!user\) \{\s*\/\/ should redirect to login but for now just ignore or toast\s*return;\s*\}\s*if \(isFollowing\) \{\s*unfollowMutation\.mutate\(id\);\s*\} else \{\s*followMutation\.mutate\(id\);\s*\}\s*\};/,
  `const handleFollowToggle = () => {
    if (!isAuthenticated) {
      navigate('/auth/login?redirect=/creators/' + id);
      return;
    }
    if (isFollowing) {
      unfollowMutation.mutate(id);
    } else {
      followMutation.mutate(id);
    }
  };`
);

// Remove the sub-filter buttons entirely
content = content.replace(
  /<div className="flex gap-3 mb-6">[\s\S]*?<\/div>/,
  ""
);

// Remove active wrap
content = content.replace(
  /\{dropsSubFilter === 'Active' && \(\s*(<div className="space-y-6">[\s\S]*?<\/div>)\s*\)\}/,
  "$1"
);

// Remove past wrap
content = content.replace(
  /\{dropsSubFilter === 'Past' && \(\s*<div className="bg-white rounded-2xl p-12 text-center border border-stone-100">\s*<p className="text-stone-500">Past drops will appear here\.<\/p>\s*<\/div>\s*\)\}/,
  ""
);

// Replace any fake rating fields
content = content.replace(/\{\(review as any\)\.name\}/g, "{review.customerName}");
content = content.replace(/\{\(review as any\)\.text\}/g, "{review.reviewText}");
content = content.replace(/\{\(review as any\)\.date\}/g, "{new Date(review.createdAt).toLocaleDateString()}");
content = content.replace(/\{\(review as any\)\.rating\}/g, "{review.score}");
content = content.replace(/review\.id/g, "review.ratingId");

fs.writeFileSync(path, content);
console.log("Updated CreatorProfilePage.tsx successfully");
