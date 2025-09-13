import './Categories.css'
import {useCategoryStore} from "../../store/category.ts";

const cats = [
    {id: 1, name: "Pizzas"},
    {id: 2, name: "Snacks"},
    {id: 3, name: "Drinks"},
    {id: 4, name: "Desserts"},
];

const Categories = () => {
    const categoryActiveId = useCategoryStore((state) => state.activeId);
    const setActiveId = useCategoryStore((state) => state.setActiveId);

    const handleCategoryClick = (id: number, name: string) => {
        setActiveId(id);

        const element = document.getElementById(name.toLowerCase());
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="categories-container">
            <h2 className="categories-title">Categories</h2>
            <div className="categories" data-testid="categories">
                {
                    cats.map(({name, id}, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryClick(id, name)}
                            className={`category-item ${categoryActiveId === id ? "active-category-item" : ""}`}
                            data-testid="category-item">
                            <span className="category-button">
                                {name}
                            </span>
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default Categories;