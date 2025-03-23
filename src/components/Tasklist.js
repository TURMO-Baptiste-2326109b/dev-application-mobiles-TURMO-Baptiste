import React, { useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, categories, onCompleteTask, onDeleteTask }) => {
    const [showAll, setShowAll] = useState(true);
    const [sortBy, setSortBy] = useState('dateEcheance');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState(null);

    const handleCategoryClick = (categoryId) => {
        setFilterCategory(categoryId === filterCategory ? null : categoryId);
    };

    const filteredTasks = tasks.filter(task => {
        // Filter out tasks with due dates older than a week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (task.dateEcheance && new Date(task.dateEcheance) < oneWeekAgo) {
            return false;
        }

        // Filter by completion status
        if (!showAll && task.statut) {
            return false;
        }

        // Filter by search term
        if (searchTerm.length >= 3 &&
            !task.intitule.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Filter by category
        if (filterCategory && !task.categories.includes(filterCategory)) {
            return false;
        }

        return true;
    });

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
            case 'intitule':
                return a.intitule.localeCompare(b.intitule);
            case 'dateCreation':
                return new Date(b.dateCreation) - new Date(a.dateCreation);
            case 'dateEcheance':
                if (!a.dateEcheance) return 1;
                if (!b.dateEcheance) return -1;
                return new Date(a.dateEcheance) - new Date(b.dateEcheance);
            case 'categorie':
                return (a.categories[0] || '').localeCompare(b.categories[0] || '');
            default:
                return 0;
        }
    });

    return (
        <div className="task-list">
            <div className="task-controls">
                <div className="view-buttons">
                    <button
                        className={`view-button ${showAll ? 'active' : ''}`}
                        onClick={() => setShowAll(true)}
                    >
                        Toutes
                    </button>
                    <button
                        className={`view-button ${!showAll ? 'active' : ''}`}
                        onClick={() => setShowAll(false)}
                    >
                        En cours
                    </button>
                </div>

                <div className="filter-container">
                    <button
                        className="filter-button"
                        onClick={() => setShowSortOptions(!showSortOptions)}
                    >
                        ⏬
                    </button>

                    {showSortOptions && (
                        <div className="sort-options">
                            <button onClick={() => setSortBy('intitule')}>Ordre alphabétique</button>
                            <button onClick={() => setSortBy('dateCreation')}>Date création</button>
                            <button onClick={() => setSortBy('dateEcheance')}>Échéance</button>
                            <button onClick={() => setSortBy('categorie')}>Catégorie</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher (min. 3 caractères)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="tasks-container">
                {sortedTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        categories={categories.filter(c => task.categories.includes(c.id))}
                        onComplete={() => onCompleteTask(task.id)}
                        onDelete={() => onDeleteTask(task.id)}
                        onCategoryClick={handleCategoryClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskList;