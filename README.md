# Backyard Birds 🐦

A beautiful, interactive website for bird enthusiasts to explore backyard birds, view recent sightings, and find notable birds by state. Built with HTML, CSS, JavaScript, React, and integrated with the eBird API.

## Features

- **Bird Gallery**: Showcase of common backyard birds with fun facts
- **Recent Sightings**: Live bird sightings from the eBird API for Los Angeles area
- **State Bird Finder**: Search for notable birds by U.S. state
- **Contact Form**: Modern contact form with validation and email functionality

## Technologies Used

- HTML5 & CSS3
- JavaScript (ES6+)
- React 17
- Tailwind CSS
- eBird API
- EmailJS for contact form

## Contact Form Setup

The contact form is fully functional with client-side validation and email integration. To enable email sending to `maryjane.zorick@gmail.com`, follow these steps:

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://emailjs.com)
2. Create a free account
3. Verify your email address

### 2. Set up Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email account
5. Note your **Service ID**

### 3. Create Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: New Contact Form Message from {{from_name}}

From: {{from_name}} ({{from_email}})
Message: {{message}}

---
Sent from Backyard Birds Contact Form
```

4. Set the template variables:
   - `from_name` - sender's name
   - `from_email` - sender's email
   - `message` - message content
5. Note your **Template ID**

### 4. Update Configuration
1. In your EmailJS dashboard, go to **Account** → **General**
2. Copy your **Public Key**
3. Open `script.js` and find line 456
4. Replace `"YOUR_PUBLIC_KEY"` with your actual public key
5. In the form submission code (around line 598), uncomment and update:

```javascript
const result = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
    from_name: name,
    from_email: email,
    message: message,
    to_email: 'maryjane.zorick@gmail.com'
});
```

Replace:
- `YOUR_SERVICE_ID` with your Service ID
- `YOUR_TEMPLATE_ID` with your Template ID

### 5. Test the Form
1. Open your website
2. Navigate to the Contact section
3. Fill out the form with test data
4. Submit and check that emails arrive at `maryjane.zorick@gmail.com`

## Current Form Features

✅ **Styling**: Modern, responsive design matching the site theme  
✅ **Validation**: Real-time validation for all fields  
✅ **User Experience**: Loading states, success/error messages  
✅ **Email Integration**: Ready for EmailJS setup  

### Form Validation Rules
- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email address format
- **Message**: 10-1000 characters

## Local Development

1. Clone this repository
2. Open `index.html` in a web browser
3. The site will load with all features functional
4. For email functionality, complete the EmailJS setup above

## API Keys

The project uses the eBird API for bird sightings. The current API key is included for demonstration purposes. For production use, you should:

1. Get your own API key from [eBird](https://ebird.org/api/keygen)
2. Replace the API key in `script.js` (line 27 and 351)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement for older browsers

## License

© 2025 Backyard Birds. All Rights Reserved.