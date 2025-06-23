jQuery Scroll Multi-Select Plugin
A lightweight, customizable multi-select dropdown plugin with search and scroll functionality for jQuery.

Features
🔍 Search functionality - Quickly filter items

🖱️ Easy selection - Click checkboxes or entire rows

♻️ Dynamic updates - Modify items on the fly

📱 Responsive design - Works on all devices

🎨 Customizable styles - Match your project's theme

🔄 API methods - Get/set selections programmatically

Installation ->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link href="css/jquery-multiselect.css" rel="stylesheet">
<script src="js/jquery-multiselect.js"></script>

Basic Usage ->
$('#my-container').multiSelect({
    items: [{ id: 1, label: 'Option 1', value: 'option1' },
        { id: 2, label: 'Option 2', value: 'option2' }
        ],
    placeholder: 'Select items...', 
    searchPlaceholder: 'Search...',
    onSelectionChange: function(selectedValues) {
        console.log('Selected:', selectedValues);
    }
});
