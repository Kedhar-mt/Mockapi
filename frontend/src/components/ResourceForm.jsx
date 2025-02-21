import React, { useState } from 'react';

const ResourceForm = ({ projectId, onClose, onSuccess }) => {
  const [resourceType, setResourceType] = useState('');
  const [resourceLabel, setResourceLabel] = useState('');
  const [resourceCategory, setResourceCategory] = useState('');
  const [showObjectFields, setShowObjectFields] = useState(false);
  const [objectName, setObjectName] = useState('');
  const [objectFields, setObjectFields] = useState([{ key: '', value: '' }]);

  const handleTypeChange = (e) => {
    setResourceType(e.target.value);
    setShowObjectFields(e.target.value === 'object');
  };

  const handleAddField = () => {
    setObjectFields([...objectFields, { key: '', value: '' }]);
  };

  const handleRemoveField = (index) => {
    const newFields = objectFields.filter((_, i) => i !== index);
    setObjectFields(newFields);
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = objectFields.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setObjectFields(newFields);
  };

  const handleSubmit = async () => {
    try {
      let payload = {
        projectId,
        label: resourceLabel,
        type: resourceType,
      };

      if (resourceType === 'object') {
        const nestedObject = {};
        objectFields.forEach(field => {
          if (field.key && field.value) {
            nestedObject[field.key] = field.value;
          }
        });
        
        payload = {
          ...payload,
          nestedResource: {
            name: objectName,
            fields: nestedObject
          }
        };
      }

      const response = await fetch('http://localhost:5000/api/projects/add-resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to add resource');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded p-6 max-w-lg w-full">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Add Resource</h2>
          <p>Fill in the details below to add a new resource.</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Resource Category"
            className="w-full p-2 border rounded"
            value={resourceCategory}
            onChange={(e) => setResourceCategory(e.target.value)}
          />
          
          <input
            type="text"
            placeholder="Resource Label"
            className="w-full p-2 border rounded"
            value={resourceLabel}
            onChange={(e) => setResourceLabel(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded"
            value={resourceType}
            onChange={handleTypeChange}
          >
            <option value="">Select Data Type</option>
            <option value="integer">Integer</option>
            <option value="string">String</option>
            <option value="boolean">Boolean</option>
            <option value="object">Object</option>
          </select>

          {showObjectFields && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Object Name"
                className="w-full p-2 border rounded"
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
              />
              
              {objectFields.map((field, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Key"
                    className="flex-1 p-2 border rounded"
                    value={field.key}
                    onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    className="flex-1 p-2 border rounded"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                  />
                  <button
                    onClick={() => handleRemoveField(index)}
                    className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
              
              <button
                onClick={handleAddField}
                className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Field
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;