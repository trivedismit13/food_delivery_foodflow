const seedDrop = async () => {
    try {
        const loginRes = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'qacreator2@test.com', password: 'password' })
        });
        const loginData = await loginRes.json();
        const token = loginData.data.token;

        const date = new Date();
        date.setDate(date.getDate() + 2); // 2 days from now
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + 1); // 1 day from now

        const dropRes = await fetch('http://localhost:8080/api/drops', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'QA Test Drop ' + Date.now(),
                description: 'A drop created for QA testing.',
                dropDate: date.toISOString().split('T')[0],
                orderCutoffTime: cutoff.toISOString(),
                pickupLocation: 'QA Kitchen',
                pickupStartTime: '18:00',
                pickupEndTime: '20:00',
                maxOrders: 10,
                status: 'OPEN'
            })
        });

        const dropData = await dropRes.json();
        console.log('Drop created:', dropRes.status, dropData);
        
        // Add item
        const dropId = dropData.data.dropId;
        const itemRes = await fetch(`http://localhost:8080/api/drops/${dropId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'QA Test Dish',
                description: 'Yummy test dish',
                price: 15.00,
                isVeg: true,
                category: 'MAIN',
                quantityAvailable: 10
            })
        });
        console.log('Item added:', itemRes.status);

    } catch (e) {
        console.error(e);
    }
};

seedDrop();
