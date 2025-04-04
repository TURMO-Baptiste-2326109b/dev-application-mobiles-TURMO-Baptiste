import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import TodoList from './components/TodoList';
import FormModal from './components/FormModal';

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [appStarted, setAppStarted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const resetData = (skipConfirmation = false) => {
    if (skipConfirmation || window.confirm('Voulez-vous vraiment remettre à zéro?')) {
      setTasks([]);
      setCategories([]);
      localStorage.removeItem('tasks');
      localStorage.removeItem('categories');
      setAppStarted(true);
    }
  };

  const handleAddTask = (task) => {
    setTasks([...tasks, {
      ...task,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
      statut: false
    }]);
    setShowModal(false);
  };

  const handleAddCategory = (category) => {
    setCategories([...categories, {
      ...category,
      id: Date.now().toString()
    }]);
    setShowModal(false);
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, statut: !task.statut } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setShowSelectionModal(false);
  };

  const handleSubmit = (formData) => {
    if (modalType === 'task') {
      handleAddTask(formData);
    } else {
      handleAddCategory(formData);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.taches && Array.isArray(data.taches)) {
          const formattedTasks = data.taches.map(task => ({
            id: task.id.toString(),
            intitule: task.title,
            description: task.description || '',
            dateCreation: convertDateFormat(task.date_creation),
            dateEcheance: convertDateFormat(task.date_echeance),
            statut: task.done,
            urgent: task.urgent,
            categories: []
          }));

          const formattedCategories = data.categories.map(cat => ({
            id: cat.id.toString(),
            intitule: cat.title,
            description: cat.description || '',
            couleur: cat.color
          }));

          if (data.relations && Array.isArray(data.relations)) {
            data.relations.forEach(relation => {
              const task = formattedTasks.find(t => t.id === relation.tache.toString());
              if (task) {
                if (!task.categories) task.categories = [];
                task.categories.push(relation.categorie.toString());
              }
            });
          }

          setTasks(formattedTasks);
          setCategories(formattedCategories);
          setAppStarted(true);
          alert('Données chargées avec succès!');
        } else {
          alert('Format de fichier JSON incorrect.');
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Erreur lors du chargement du fichier JSON.');
      }
    };
    reader.readAsText(file);

    event.target.value = null;
  };

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  return (
      <div className="App">
        {!appStarted ? (
            <div className="start-screen">
              <div className="start-container">
                <h1>Todo List</h1>
                <p>Choisissez comment démarrer l'application</p>

                <div className="start-buttons">
                  <button
                      className="start-button"
                      onClick={() => resetData(true)}
                  >
                    Commencer sans données
                  </button>

                  <button
                      className="start-button"
                      onClick={() => fileInputRef.current.click()}
                  >
                    Charger un backup
                  </button>

                  <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      style={{display: 'none'}}
                      onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>
        ) : (
            <>
              <Header
                  onReset={resetData}
                  onImport={handleFileUpload}
                  fileInputRef={fileInputRef}
              />

              <div className="content">
                <TodoList
                    tasks={tasks}
                    categories={categories}
                    onCompleteTask={handleCompleteTask}
                    onDeleteTask={handleDeleteTask}
                />

                <FormModal
                    isOpen={showModal}
                    type={modalType}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowModal(false)}
                />

                {showSelectionModal && (
                    <div className="selection-modal-overlay">
                      <div className="selection-modal">
                        <h3>Que souhaitez-vous ajouter ?</h3>
                        <div className="selection-buttons">
                          <button className="add-button" onClick={() => openModal('task')}>
                            Ajouter tâche
                          </button>
                          <button className="add-button" onClick={() => openModal('category')}>
                            Ajouter catégorie
                          </button>
                        </div>
                        <button className="close-button" onClick={() => setShowSelectionModal(false)}>
                          Annuler
                        </button>
                      </div>
                    </div>
                )}

                <div className="fab-container">
                  <button
                      className="fab-button"
                      onClick={() => setShowSelectionModal(true)}
                  >
                    +
                  </button>
                </div>
              </div>

              <Footer />
            </>
        )}
      </div>
  );
}

export default App;