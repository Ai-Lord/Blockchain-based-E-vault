let userId;

document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch data from a protected endpoint
    function fetchData(url, token) {
        return fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Include the token in the Authorization header
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fetch failed');
            }
            return response.json();
        })
        .then(user => {
            userId = user.user._id;
            // Process the fetched data as needed
            console.log(user);
            const userDetailsDiv = document.getElementById('userDetails');
            userDetailsDiv.innerHTML = `
                <h2>User Details</h2>
                <p><strong>User ID:</strong> ${userId}</p>
                <p><strong>Name:</strong> ${user.user.name}</p>
                <p><strong>Email:</strong> ${user.user.email}</p>
                <p><strong>Role:</strong> ${user.user.role}</p>
            `;
        })
        .catch(error => {
            console.error(error);
        });
    }

    // Example usage: Fetch data from a protected endpoint (profile)
    const profileUrl = 'http://localhost:3000/user/profile';
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (token) {
        fetchData(profileUrl, token);
    } else {
        console.error('Token not found');
    }
});
    
