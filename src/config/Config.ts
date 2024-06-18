import Realm from 'realm';

// Define the Experience schema
class Experience extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'Experience',
    properties: {
      _id: 'objectId',
      company: 'string',
      role: 'string',
      startDate: 'date',
      endDate: 'date',
    },
    primaryKey: '_id',
  };
}

// Define the Education schema
class Education extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'Education',
    properties: {
      _id: 'objectId',
      institution: 'string',
      degree: 'string',
      location: 'string',
      graduationDate: 'date',
    },
    primaryKey: '_id',
  };
}

// Define the Certification schema
class Certification extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'Certification',
    properties: {
      _id: 'objectId',
      name: 'string',
      institution: 'string',
      date: 'date',
    },
    primaryKey: '_id',
  };
}

// Define the Resume schema
class Resume extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'Resume',
    properties: {
      _id: 'objectId',
      name: 'string',
      email: 'string',
      phone: 'string',
      profilePhoto: {type: 'string', optional: true},
      summary: {type: 'string', optional: true},
      skills: {type: 'string', optional: true},
      experience: {type: 'list', objectType: 'Experience'},
      education: {type: 'list', objectType: 'Education'},
      certifications: {type: 'list', objectType: 'Certification'},
      templateId: {type: 'int', default: 1}, // New property with a default value
    },
    primaryKey: '_id',
  };
}

// Create a configuration
const realmConfig: Realm.Configuration = {
  schema: [Resume, Experience, Education, Certification],
  schemaVersion: 3, // Update schema version to match the new schema
  migration: (oldRealm, newRealm) => {
    // Perform migration if needed (e.g., adding new properties)
    if (oldRealm.schemaVersion < 3) {
      const oldObjects = oldRealm.objects<Realm.Object & {templateId?: number}>(
        'Resume',
      );
      const newObjects = newRealm.objects<Realm.Object & {templateId: number}>(
        'Resume',
      );

      for (let i = 0; i < oldObjects.length; i++) {
        if (oldObjects[i].templateId === undefined) {
          newObjects[i].templateId = 1; // Set default value for existing objects
        }
      }
    }
  },
};

export {realmConfig, Resume, Experience, Education, Certification};
