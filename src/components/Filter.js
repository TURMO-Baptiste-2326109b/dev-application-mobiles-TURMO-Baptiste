import React, { useState, useEffect } from 'react';

const Filter = ({ tasks, onFilterChange }) => {
    const [showAll, setShowAll] = useState(true);
    const [sortBy, setSortBy] = useState('dateEcheance');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState(null);

    useEffect(() => {
        const filteredTasks = tasks.filter(task => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            if (task.dateEcheance && new Date(task.dateEcheance) < oneWeekAgo) {
                return false;
            }

            if (!showAll && task.statut) {
                return false;
            }

            if (searchTerm.length >= 3 &&
                !task.intitule.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            if (filterCategory && !task.categories.includes(filterCategory)) {
                return false;
            }

            return true;
        });

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

        onFilterChange(sortedTasks);
    }, [tasks, showAll, sortBy, searchTerm, filterCategory, onFilterChange]);

    return (
        <>
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
        </>
    );
};

export default Filter;