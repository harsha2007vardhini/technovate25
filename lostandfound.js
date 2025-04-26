
    const itemForm = document.getElementById('itemForm');
    const itemsList = document.getElementById('itemsList');
    const itemLocation = document.getElementById('itemLocation');
    const itemType = document.getElementById('itemType');

    const sections = ['home', 'reportItem', 'viewItems'];

    function showSection(id) {
      sections.forEach(sec => {
        document.getElementById(sec).classList.add('hidden');
        
      });
      document.getElementById(id).classList.remove('hidden');

      if (id === 'viewItems') {
        displayItems();
      }
    }

    function updateLocationPlaceholder() {
      const type = itemType.value;
      itemLocation.placeholder = type === 'Found' ? 'Found Location' : type === 'Lost' ? 'Lost Location' : 'Location';
    }

    function saveItem(data) {
      const items = JSON.parse(localStorage.getItem('lostFoundItems') || '[]');
      items.push(data);
      localStorage.setItem('lostFoundItems', JSON.stringify(items));
    }

   /* function deleteItem(index) {
      const items = JSON.parse(localStorage.getItem('lostFoundItems') || '[]');
      items.splice(index, 1);  // Remove item at the given index
      localStorage.setItem('lostFoundItems', JSON.stringify(items));
      displayItems();  // Refresh the item display
    }
*/
    function displayItems() {
      const items = JSON.parse(localStorage.getItem('lostFoundItems') || '[]');
      itemsList.innerHTML = '';
      if (items.length === 0) {
        itemsList.innerHTML = '<p>No items reported yet.</p>';
        return;
      }

      items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        const locLabel = item.type === 'Found' ? 'Found Location' : 'Lost Location';
        div.innerHTML = `
          <strong>Type:</strong> ${item.type}<br/>
          <strong>Name:</strong> ${item.name}<br/>
          <strong>${locLabel}:</strong> ${item.location}<br/>
          <strong>Date:</strong> ${item.date}<br/>
          <p><strong>Description:</strong> ${item.description}</p>
          ${item.image ? `<img src="${item.image}" alt="Item Image">` : ''}
          <p><small>Reported by: ${item.email}</small></p>
          <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>  <!-- Delete button -->
        `;
        itemsList.appendChild(div);
      });
    }

    function sendEmailNotification(data) {
      console.log("Sending email to:", data.email);
      console.log("Item details:", data);
      // For real email notifications, integrate with EmailJS or backend server
    }

    itemForm.addEventListener('submit', e => {
      e.preventDefault();

      const fileInput = document.getElementById('itemImage');
      const file = fileInput.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          submitForm(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        submitForm('');
      }

      function submitForm(imageData) {
        const data = {
          type: itemType.value,
          name: document.getElementById('itemName').value,
          location: itemLocation.value,
          date: document.getElementById('itemDate').value,
          description: document.getElementById('itemDescription').value,
          image: imageData,
          email: document.getElementById('userEmail').value
        };

        saveItem(data);
        sendEmailNotification(data);
        alert(`${data.type} item reported!`);
        itemForm.reset();
        itemLocation.placeholder = 'Location';
        showSection('home');
      }
    });

    showSection('home');
