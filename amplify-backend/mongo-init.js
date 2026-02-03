// MongoDB initialization script
// This runs when the container is first created

db = db.getSiblingDB('amplify-dashboard');

// Create collections with validation
db.createCollection('templates', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'description', 'previewType', 'previewUrl', 'category', 'templateCategory'],
      properties: {
        title: { bsonType: 'string' },
        description: { bsonType: 'string' },
        previewType: { enum: ['image', 'video'] },
        previewUrl: { bsonType: 'string' },
        category: { bsonType: 'string' },
        templateCategory: { enum: ['image-ads', 'video-ads', 'ai-models', 'seasonal', 'trending'] },
      },
    },
  },
});

db.createCollection('saved_ads');
db.createCollection('competitor_ads');
db.createCollection('audit_logs');

// Create indexes
db.templates.createIndex({ templateCategory: 1, isActive: 1 });
db.templates.createIndex({ category: 1, style: 1 });
db.templates.createIndex({ niche: 1, subNiche: 1 });
db.templates.createIndex({ tags: 1 });

db.saved_ads.createIndex({ userId: 1, adId: 1 }, { unique: true });
db.saved_ads.createIndex({ userId: 1, adType: 1 });

db.competitor_ads.createIndex({ platform: 1, status: 1 });
db.competitor_ads.createIndex({ niche: 1, subNiche: 1 });
db.competitor_ads.createIndex({ brand: 1 });
db.competitor_ads.createIndex({ adScore: -1 });

db.audit_logs.createIndex({ userId: 1, timestamp: -1 });
db.audit_logs.createIndex({ resource: 1, action: 1, timestamp: -1 });

print('Database initialized successfully');
