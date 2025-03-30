import React, { useState } from 'react';
import TaskItem from './TaskItem';
import Filter from './Filter';

const TodoList = ({ tasks, categories, onCompleteTask, onDeleteTask }) => {
    const [filteredTasks, setFilteredTasks] = React.useState([]);
    const [filterCategory, setFilterCategory] = useState(null);

    const handleCategoryClick = (categoryId) => {
        setFilterCategory(categoryId === filterCategory ? null : categoryId);
    };

    return (
        <div className="task-list">
            <Filter
                tasks={tasks}
                onFilterChange={setFilteredTasks}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
            />

            {filterCategory && (
                <div className="active-filter">
                    <span>
                        Filtré par: {categories.find(c => c.id === filterCategory)?.intitule}
                    </span>
                    <button onClick={() => setFilterCategory(null)}>✕</button>
                </div>
            )}

            <div className="tasks-container">
                {filteredTasks.map(task => (
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

export default TodoList;