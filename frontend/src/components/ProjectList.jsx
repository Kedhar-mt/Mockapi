import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [resourceLabel, setResourceLabel] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [currentResourceId, setCurrentResourceId] = useState("");
  const [resourceValue, setResourceValue] = useState("");
  const [editProjectName, setEditProjectName] = useState("");
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [editResourceLabel, setEditResourceLabel] = useState("");
  const [showEditResourceLabelForm, setShowEditResourceLabelForm] =
    useState(false);
  const [showAddResourceToAllForm, setShowAddResourceToAllForm] =
    useState(false);
  const [currentProjectName, setCurrentProjectName] = useState("");
  const [newEntriesCount, setNewEntriesCount] = useState(1);
  const [showAddDataForm, setShowAddDataForm] = useState(false);
  const [currentProjectIdForData, setCurrentProjectIdForData] = useState("");
  const [fakerLabels, setFakerLabels] = useState({});
  const [availableLabels, setAvailableLabels] = useState([]);
  const [resourceCategory, setResourceCategory] = useState('');
  const [showObjectFields, setShowObjectFields] = useState(false);
  const [objectName, setObjectName] = useState("");
  const [objectFields, setObjectFields] = useState([{ key: "", value: "" }]);


  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error fetching projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchFakerLabels = async () => {
      try {
        const res = await axios.get('http://localhost:5000/faker-labels');
        setFakerLabels(res.data);
      } catch (error) {
        console.error('Error fetching faker labels:', error);
      }
    };
    fetchFakerLabels();
  }, []);

  useEffect(() => {
    if (resourceCategory) {
      setAvailableLabels(fakerLabels[resourceCategory] || []);
    }
  }, [resourceCategory,resourceType,fakerLabels]);

  // New functions for handling object fields
  const handleAddField = () => {
    setObjectFields([...objectFields, { key: "", value: "" }]);
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

  const handleTypeChange = (e) => {
    setResourceType(e.target.value);
    setShowObjectFields(e.target.value === 'object');
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/projects", {
        name: newProjectName,
      });
      setNewProjectName("");
      setApiUrl(res.data.endpoint);
      fetchProjects();
      toast.success("Project created successfully");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error creating project");
    }
  };


 /* const addResource = async () => {
    if (!resourceLabel.trim() || !resourceType) return;
    try {
      const project = projects.find((project) => project._id === currentProjectId);
      if (!project) {
        console.error("Project not found");
        toast.error("Project not found");
        return;
      }
      const payload = {
        projectId: project._id,
        label: resourceLabel,
        type: resourceType,
      };
      await axios.post("http://localhost:5000/api/projects/add-resource", payload);
      fetchProjects();
      setShowResourceForm(false);
      setResourceLabel("");
      setResourceType("");
      toast.success("Resource added successfully");
    } catch (error) {
      console.error("Error adding resource:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      toast.error("Error adding resource");
    }
  };*/

  const addResourceToAll = async () => {
    if (!resourceLabel.trim() || !resourceType) return;
    try {
      const payload = {
        projectName: currentProjectName,
        label: resourceLabel,
        type: resourceType,
      };
      await axios.post(
        "http://localhost:5000/api/projects/add-resource-to-all",
        payload
      );
      fetchProjects();
      setShowAddResourceToAllForm(false);
      setResourceLabel("");
      setResourceType("");
      toast.success("Resource added to all entries successfully");
    } catch (error) {
      console.error("Error adding resource to all entries:", error);
      toast.error("Error adding resource to all entries");
    }
  };

  const updateResource = async () => {
    if (!resourceValue.trim()) return;
    try {
      const payload = {
        projectId: currentProjectId,
        resourceId: currentResourceId,
        value: resourceValue,
      };
      await axios.put(
        "http://localhost:5000/api/projects/update-resource",
        payload
      );
      fetchProjects();
      setShowEditForm(false);
      setResourceValue("");
      toast.success("Resource updated successfully");
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Error updating resource");
    }
  };

  const deleteResource = async (projectId, resourceId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/projects/delete-resource/${projectId}/${resourceId}`
      );
      fetchProjects();
      toast.success("Resource deleted successfully");
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Error deleting resource");
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/projects/delete-entry/${entryId}`
      );
      fetchProjects();
      toast.success("Entry deleted successfully");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Error deleting entry");
    }
  };

  const deleteProject = async (projectName) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the project "${projectName}" and all its entries?`
      );
      if (!confirmDelete) return;
      await axios.delete(
        `http://localhost:5000/api/projects/delete-project/${projectName}`
      );
      fetchProjects();
      toast.success("Project and all entries deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project");
    }
  };

  const addNewData = async (projectId) => {
    try {
      await axios.post("http://localhost:5000/api/projects/add-new-data", {
        projectId: projectId,
      });
      fetchProjects();
      toast.success("New data added successfully");
    } catch (error) {
      console.error("Error adding new data:", error);
      toast.error("Error adding new data");
    }
  };

   // Updated addResource function
   const addResource = async () => {
    if (!resourceLabel.trim() || !resourceType) return;
    try {
      let payload = {
        projectId: currentProjectId,
        label: resourceLabel,
        type: resourceType
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

      await axios.post("http://localhost:5000/api/projects/add-resource", payload);
      fetchProjects();
      setShowResourceForm(false);
      resetResourceForm();
      toast.success("Resource added successfully");
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error("Error adding resource");
    }
  };

  // Helper function to reset resource form
  const resetResourceForm = () => {
    setResourceLabel("");
    setResourceType("");
    setResourceCategory("");
    setShowObjectFields(false);
    setObjectName("");
    setObjectFields([{ key: "", value: "" }]);
  };
  
  const addNewDataBatch = async (projectId, count) => {
    try {
      await axios.post("http://localhost:5000/api/projects/add-new-data", {
        projectId: projectId,
        count: parseInt(count),
      });
      fetchProjects();
      setShowAddDataForm(false);
      setNewEntriesCount(1);
      toast.success(`${count} new entries added successfully`);
    } catch (error) {
      console.error("Error adding new data:", error);
      toast.error("Error adding new data");
    }
  };

  const handleAddDataClick = (projectId) => {
    setCurrentProjectIdForData(projectId);
    setShowAddDataForm(true);
  };

  const handleAddResourceClick = (projectId) => {
    setCurrentProjectId(projectId);
    setShowResourceForm(true);
    setShowEditForm(false);
  };

  const handleAddResourceToAllClick = (projectName) => {
    setCurrentProjectName(projectName);
    setShowAddResourceToAllForm(true);
  };

  const handleEditDataClick = (projectId, resourceId) => {
    setCurrentProjectId(projectId);
    setCurrentResourceId(resourceId);
    setShowEditForm(true);
    setShowResourceForm(false);
  };

  const handleEditProjectClick = (projectId, projectName) => {
    setCurrentProjectId(projectId);
    setEditProjectName(projectName);
    setShowEditProjectForm(true);
  };

  const handleEditResourceLabelClick = (
    projectId,
    resourceId,
    resourceLabel
  ) => {
    setCurrentProjectId(projectId);
    setCurrentResourceId(resourceId);
    setEditResourceLabel(resourceLabel);
    setShowEditResourceLabelForm(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      createProject();
    }
  };

  const updateProjectName = async () => {
    if (!editProjectName.trim()) return;
    try {
      const payload = {
        projectId: currentProjectId,
        newName: editProjectName,
      };
      await axios.put(
        "http://localhost:5000/api/projects/update-project-name",
        payload
      );
      fetchProjects();
      setShowEditProjectForm(false);
      setEditProjectName("");
      toast.success("Project name updated successfully");
    } catch (error) {
      console.error("Error updating project name:", error);
      toast.error("Error updating project name");
    }
  };

  const updateResourceLabel = async () => {
    if (!editResourceLabel.trim()) return;
    try {
      const payload = {
        projectId: currentProjectId,
        resourceId: currentResourceId,
        newLabel: editResourceLabel,
      };
      await axios.put(
        "http://localhost:5000/api/projects/update-resource-label",
        payload
      );
      fetchProjects();
      setShowEditResourceLabelForm(false);
      setEditResourceLabel("");
      toast.success("Resource label updated successfully");
    } catch (error) {
      console.error("Error updating resource label:", error);
      toast.error("Error updating resource label");
    }
  };

  const deleteResourceFromAll = async (projectName, resourceLabel) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${resourceLabel}" from all entries in project "${projectName}"?`
      );
      if (!confirmDelete) return;

      await axios.delete(
        `http://localhost:5000/api/projects/delete-resource-from-all/${projectName}/${resourceLabel}`
      );
      fetchProjects();
      toast.success("Resource deleted from all entries successfully");
    } catch (error) {
      console.error("Error deleting resource from all entries:", error);
      toast.error("Error deleting resource from all entries");
    }
  };
  const handleEntriesCountChange = (e) => {
    const value = e.target.value;
    const numberValue = Number(value);

    // Ensure the value is within the valid range
    if (numberValue >= 1 && numberValue <= 100) {
      setNewEntriesCount(value);
    } else if (value === '') {
      // Allow clearing the input
      setNewEntriesCount('');
    }
  };

  // Group projects by name
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.name]) {
      acc[project.name] = [];
    }
    acc[project.name].push(project);
    return acc;
  }, {});

  const renderResourceForm = () => {
    if (!showResourceForm) return null;
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Add Resource</h3>
          <div className="modal-content">
            <input
              type="text"
              placeholder="Resource Category"
              className="w-full p-2 border rounded mb-4"
              value={resourceCategory}
              onChange={(e) => setResourceCategory(e.target.value)}
            />
            
            <input
              type="text"
              placeholder="Resource Label"
              className="w-full p-2 border rounded mb-4"
              value={resourceLabel}
              onChange={(e) => setResourceLabel(e.target.value)}
            />

            <select
              className="w-full p-2 border rounded mb-4"
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
              <div className="space-y-4 mb-4">
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

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowResourceForm(false);
                  resetResourceForm();
                }}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={addResource}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="container">
      <ToastContainer />
      <h1>Projects</h1>
      <div className="project-input">
        <input
          type="text"
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={createProject}
          title="Create a new project with the specified name"
        >
          Create Project
        </button>
      </div>

      <div className="project-list">
      {Object.entries(groupedProjects).map(
          ([projectName, projectEntries]) => {
            const projectEndpoint = `http://localhost:5000/api/projects/${projectName
              .toLowerCase()
              .replace(/\s+/g, "-")}`;
            return (
              <div key={projectName} className="project-group">
                <div className="project-header">
                  <h2>
                    <a
                      href={projectEndpoint}
                      title={projectEndpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {projectName}
                    </a>
                  </h2>
                  <div className="project-buttons">
                    <button
                      className="add-data-btn"
                      onClick={() => handleAddDataClick(projectEntries[0]._id)}
                      title="Add multiple new data entries to this project"
                    >
                      Add New Data
                    </button>
                    <button
                      className="add-resource-to-all-btn"
                      onClick={() => handleAddResourceToAllClick(projectName)}
                      title="Add a resource to all entries in this project"
                    >
                      Add Resource to All
                    </button>
                    <button
                      className="edit-project-btn"
                      onClick={() =>
                        handleEditProjectClick(
                          projectEntries[0]._id,
                          projectName
                        )
                      }
                      title="Edit the name of this project"
                    >
                      Edit Project Name
                    </button>
                    <button
                      className="delete-project-btn"
                      onClick={() => deleteProject(projectName)}
                      title="Delete this project and all its entries"
                    >
                      Delete Project
                    </button>
                  </div>
                </div>

                <div className="entries-container">
                  {projectEntries.map((entry, index) => (
                    <div key={entry._id} className="project-entry">
                      <div className="entry-header">
                        <h3>Entry {index + 1}</h3>
                        <div className="entry-buttons">
                          <button
                            className="add-resource-btn"
                            onClick={() => handleAddResourceClick(entry._id)}
                            title="Add a new resource to this entry"
                          >
                            Add Resource
                          </button>
                          <button
                            className="delete-entry-btn"
                            onClick={() => deleteEntry(entry._id)}
                            title="Delete this entry from the project"
                          >
                            Delete Entry
                          </button>
                        </div>
                      </div>
                      <div className="resources-list">
                        {entry.resources.map((resource) => (
                          <div key={resource._id} className="resource-item">
                            <span className="resource-content">
                              <strong>{resource.label}:</strong>{" "}
                              {typeof resource.value === 'object' ? JSON.stringify(resource.value) : resource.value}
                            </span>
                            <div className="resource-buttons">
                              <button
                                className="edit-btn"
                                onClick={() =>
                                  handleEditDataClick(entry._id, resource._id)
                                }
                                title="Edit the value of this resource"
                              >
                                Edit
                              </button>
                              <button
                                className="edit-label-btn"
                                onClick={() =>
                                  handleEditResourceLabelClick(
                                    entry._id,
                                    resource._id,
                                    resource.label
                                  )
                                }
                                title="Edit the label of this resource"
                              >
                                Edit Label
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() =>
                                  deleteResource(entry._id, resource._id)
                                }
                                title="Delete this resource from the entry"
                              >
                                Delete
                              </button>
                              <button
                                className="delete-all-btn"
                                onClick={() =>
                                  deleteResourceFromAll(
                                    entry.name,
                                    resource.label
                                  )
                                }
                                title="Delete this resource from all entries in the project"
                              >
                                Delete From All
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
      {renderResourceForm()}
      {showAddDataForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Multiple Entries</h3>
            <div className="modal-content">
              <input
                type="number"
                min="1"
                max="100"
                placeholder="Number of entries"
                value={newEntriesCount}
                onChange={handleEntriesCountChange}
              />
              <div className="modal-buttons">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddDataForm(false);
                    setNewEntriesCount('');
                  }}
                  title="Cancel adding new entries"
                >
                  Cancel
                </button>
                <button 
                  className="submit-btn"
                  onClick={() => addNewDataBatch(currentProjectIdForData, newEntriesCount)}
                  title="Add the specified number of entries"
                >
                  Add Entries
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddResourceToAllForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Resource to All Entries</h3>
            <div className="modal-content">
              <input
                type="text"
                placeholder="Label"
                value={resourceLabel}
                onChange={(e) => setResourceLabel(e.target.value)}
              />
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              >
                <option value="">Select Data Type</option>
                <option value="integer">Integer</option>
                <option value="string">String</option>
                <option value="boolean">Boolean</option>
              </select>
              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setShowAddResourceToAllForm(false)}
                  title="Cancel adding a resource to all entries"
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={addResourceToAll}
                  title="Submit the resource to all entries"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Resource</h3>
            <div className="modal-content">
              <input
                type="text"
                placeholder="New Value"
                value={resourceValue}
                onChange={(e) => setResourceValue(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setShowEditForm(false)}
                  title="Cancel editing the resource"
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={updateResource}
                  title="Submit the updated resource"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditProjectForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Project Name</h3>
            <div className="modal-content">
              <input
                type="text"
                placeholder="New Project Name"
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setShowEditProjectForm(false)}
                  title="Cancel editing the project name"
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={updateProjectName}
                  title="Submit the updated project name"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditResourceLabelForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Resource Label</h3>
            <div className="modal-content">
              <input
                type="text"
                placeholder="New Resource Label"
                value={editResourceLabel}
                onChange={(e) => setEditResourceLabel(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setShowEditResourceLabelForm(false)}
                  title="Cancel editing the resource label"
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={updateResourceLabel}
                  title="Submit the updated resource label"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;