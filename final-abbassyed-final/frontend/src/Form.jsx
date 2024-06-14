import React, {useState} from "react";

const Form = ({addShoe}) => {
    const [shoe, setShoe] = useState(
        {
            brand: '',
            model: '',
            description: '',
            designer: '',
            releaseYear: '',
            originalPrice: '',
            category: '',
            image: ''
        }
    );

    const [showForm, setShowForm] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setShoe((prevShoe) => ({
            ...prevShoe,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!shoe.brand || !shoe.category || !shoe.image || !shoe.releaseYear || !shoe.model || !shoe.designer || !shoe.description || !shoe.originalPrice) {
            return;
        }
        try {
            await addShoe(shoe);
            console.log("before shoe creation:");
            setShoe({
                brand: "",
                originalPrice: "",
                releaseYear: "",
                description: "",
                model: "",
                designer: "",
                category: "",
                image: null,
            });
            setShowForm(false);
        } catch (error) {
            console.log("error adding shoes:", error.response);
        }
    };
    const handleImageChange = (event) => {
        setShoe({...shoe, image: event.target.files[0]});
    };

    const toggleForm = () => {
        setShowForm((prevShowForm) => !prevShowForm);
    }

    return (
        <div className="form1-container">

                <div className="form2-container">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="form2-group">
                            <label htmlFor="brand" className="label2">Brand:</label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={shoe.brand}
                                onChange={handleChange}
                                className="form2-input"
                            />
                        </div>
                        <div className="form2-group">
                            <label htmlFor="originalPrice" className="label2">Original Price(in cents):</label>
                            <input
                                type="text"
                                id="originalPrice"
                                name="originalPrice"
                                value={shoe.originalPrice}
                                onChange={handleChange}
                                className="form2-input"
                            />
                        </div>
                        <div className="form2-group">
                            <label htmlFor="releaseYear" className="label2">Release Year:</label>
                            <input
                                type="text"
                                id="releaseYear"
                                name="releaseYear"
                                value={shoe.releaseYear}
                                onChange={handleChange}
                                className="form2-input"
                            />
                        </div>
                        <div className="form2-group">
                            <label htmlFor="description" className="label2">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={shoe.description}
                                onChange={handleChange}
                                className="form2-input"
                            />
                        </div>
                        <div className="form2-group">
                            <label htmlFor="model" className="label2">Model:</label>
                            <input
                                type="text"
                                id="model"
                                name="model"
                                value={shoe.model}
                                onChange={handleChange}
                                className="form2-input"
                            />
                        </div>
                        <div className="form2-group">
                            <label htmlFor="designer" className="label2">Designer:</label>
                            <input
                                type="text"
                                id="designer"
                                name="designer"
                                value={shoe.designer}
                                onChange={handleChange}
                                className="form2-input"
                            />
                        </div>
                        <div className="form2-group">
                            <label className="label2">Category:</label>
                            <div className="category-options">
                                <label>
                                    <input
                                        type="radio"
                                        name="category"
                                        value="Men"
                                        checked={shoe.category === "Men"}
                                        onChange={handleChange}
                                    />
                                    Men
                                </label>
                            <label>
                                <input
                                        type="radio"
                                        name="category"
                                        value="women"
                                        checked={shoe.category === "women"}
                                        onChange={handleChange}
                                    />
                                    Women
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="category"
                                        value="kids"
                                        checked={shoe.category === "kids"}
                                        onChange={handleChange}
                                    />
                                    Kids
                                </label>
                            </div>
                        </div>
                            <div className="form2-group">
                                <label htmlFor="image" className="label2">Image:</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    className="form2-input"
                                />
                            </div>
                            <div className="form2-group">
                                <button type="submit" className="form2-submit-button">Submit</button>
                            </div>
                    </form>
                </div>
        </div>
    );
};
export default Form;