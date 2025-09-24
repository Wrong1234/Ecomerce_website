import React from "react";

const ForgetPassword = () => {

    const [formData, setFormData] = useState([
        email = ''
    ]);

    const handleChange = (e) =>{

    }
    return (
        <>
        <div>
            <div>
                 <h1>Check email and click link and changed password</h1>
                 <form onSubmit={handleSubmit} noValidate>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input 
                        type="text" 
                        name="email"
                        onchange={handleChange}
                        value={formData.email}
                        placeholder="Enter your email"
                        />
                        {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                        )}
                    </div>
                    <div>
                        <button
                        type="submit"
                         disabled={loading}
                        >
                        {loading ? (
                        <>
                            <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                            ></span>
                            Check Email...
                        </>
                        ) : (
                        'Submit'
                        )}
                        </button>
                    </div>
                 </form>

            </div>
        </div>
        </>
    );
}

export default ForgetPassword;