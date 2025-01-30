const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  permissions: {
    type: [String],
    default: ['manage_users', 'delete_posts'], // Admin-specific field
  },
});

// Create Admin discriminator
const Admin = User.discriminator('Admin', adminSchema);
