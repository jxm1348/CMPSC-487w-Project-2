document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('list');
    function generateRandomId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    document.getElementById('addItemButton').addEventListener('click', addItem);
    function addItem() {
        const nameInput = document.getElementById('nameInput');
        const descriptionInput = document.getElementById('descriptionInput');
        const imageInput = document.getElementById('imageInput');

        const name = nameInput.value;
        const description = descriptionInput.value;
        const image = imageInput.value;

        // Generate a unique random ID as a string
        const uniqueId = generateRandomId(5).toString(); // Convert to string

        console.log(name, description, image, uniqueId); // Debug line

        // Send a POST request to add the item with the unique ID
        fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: uniqueId, name, description, image }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message); // Debug line
                // Clear input fields
                nameInput.value = '';
                descriptionInput.value = '';
                imageInput.value = '';
                // Reload the items after adding a new one
                loadItems();
            })
            .catch((error) => {
                console.error('Error adding item:', error);
            });
    }

    function editItem(id, newName, newDescription, newImage) {
        const name = newName; // Get the updated name from your user interface
        const description = newDescription; // Get the updated description from your user interface
        const image = newImage; // Get the updated image from your user interface

        // Send a PUT request to update the item
        fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, description, image}),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message); // Log the response from the server
                // Optionally, you can reload the items after editing
                loadItems();
            })
            .catch((error) => {
                console.error('Error editing item:', error);
            });
    }

    function removeItem(id) {
        // Send a DELETE request to remove the item
        fetch(`/api/items/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message); // Log the response from the server
                // Optionally, you can reload the items after removal
                loadItems();
            })
            .catch((error) => {
                console.error('Error removing item:', error);
            });
    }

    // Function to load and display items from the server
    function loadItems() {
        fetch('/api/items')
            .then((response) => response.json())
            .then((results) => {
                updateUI(results);
            })
            .catch((error) => {
                console.error('Error loading items:', error);
            });
    }

    // Add event listeners, e.g., for form submission and buttons
    // You can use the Fetch API to send data to your server

    document.getElementById('searchButton').addEventListener('click', performSearch);

    function performSearch() {
        const keyword = document.getElementById('searchInput').value;
        search(keyword);
    }

    function search(keyword) {
        // Implement the search functionality
        const sql = "SELECT * FROM sunlabdatabase WHERE name LIKE ? OR description LIKE ?";
        fetch(`/api/items/search?keyword=${keyword}`)
            .then((response) => response.json())
            .then((results) => {
                updateUI(results);
            })
            .catch((error) => {
                console.error("Error searching for items: " + error);
            });
    }

    document.getElementById('sortByID').addEventListener('click', sortItemsByID);
    function sortItemsByID() {
        // Implement sorting by ID
        fetch('/api/items/sort?sortBy=id')
            .then((response) => response.json())
            .then((results) => {
                updateUI(results);
            })
            .catch((error) => {
                console.error("Error sorting items by ID: " + error);
            });
    }

    document.getElementById('sortByName').addEventListener('click', sortItemsByName);
    function sortItemsByName() {
        // Implement sorting by name
        fetch('/api/items/sort?sortBy=name')
            .then((response) => response.json())
            .then((results) => {
                updateUI(results);
            })
            .catch((error) => {
                console.error("Error sorting items by name: " + error);
            });
    }

    // Function to update the UI with items
    function updateUI(items) {
        listContainer.innerHTML = ''; // Clear existing data in the table

        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td><img src="${item.image}" alt="${item.name}" class="item-image"></td>
            <td>
                <button type="button" class="edit-item" data-id="${item.id}">Edit</button>
                <button type="button" class="remove-item" data-id="${item.id}">Remove</button>
            </td>
        `;

            listContainer.appendChild(row);
        });
    }


    listContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-item')) {
            const id = event.target.getAttribute('data-id');
            const newName = prompt('Enter new name:');
            const newDescription = prompt('Enter new description:');
            const newImage = prompt('Enter new image URL:');
            editItem(id, newName, newDescription, newImage);
        } else if (event.target.classList.contains('remove-item')) {
            const id = event.target.getAttribute('data-id');
            if (confirm('Are you sure you want to remove this item?')) {
                removeItem(id);
            }
        }
    });

    // Initial load
    loadItems();
});