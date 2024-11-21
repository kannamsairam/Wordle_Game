
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import styles from './LoginSignup.module.scss';
import person_icon from '../assets/person.png';
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";

const LoginSignup = () => {
    const navigate = useNavigate();
    const [action, setAction] = useState('Login');
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [resetPasswordMode, setResetPasswordMode] = useState(false);  // New state for Reset Password
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupUserName, setSignupUserName] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetCode, setResetCode] = useState('');  // State for reset code input
    const [newPassword, setNewPassword] = useState('');  // State for new password input
    const [confirmNewPassword, setConfirmNewPassword] = useState('');  // State for confirm new password
    const [errors, setErrors] = useState({});

    const toggleAction = () => {
        setAction(action === 'Login' ? 'Signup' : 'Login');
        setForgotPasswordMode(false);
        setResetPasswordMode(false);  // Reset the reset password mode
        setErrors({});
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return emailPattern.test(email);
    };

    const validatePhone = (phone) => {
        const phonePattern = /^[789]\d{9}$/; // Indian phone number validation
        return phonePattern.test(phone);
    };

    const handleSubmit = async () => {
        const newErrors = {};

        if (action === 'Signup') {
            if (!signupUserName) newErrors.signupUserName = "Username is required";
            if (!signupPhone) newErrors.signupPhone = "Phone number is required";
            if (!signupEmail) {
                newErrors.signupEmail = "Email is required";
            } else if (!validatePhone(signupPhone)) {
                newErrors.signupPhone = "Invalid Indian phone number";
            } else if (!validateEmail(signupEmail)) {
                newErrors.signupEmail = "Invalid email format";
            }
            if (!signupPassword) {
                newErrors.signupPassword = "Password is required";
            } else if (signupPassword.length < 8) {
                newErrors.signupPassword = "Password must be at least 8 characters";
            }
            if (signupPassword !== confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        } else if (!forgotPasswordMode && !resetPasswordMode) {
            if (!loginEmail) {
                newErrors.loginEmail = "Email is required";
            } else if (!validateEmail(loginEmail)) {
                newErrors.loginEmail = "Invalid email format";
            }
            if (!loginPassword) {
                newErrors.loginPassword = "Password is required";
            } else if (loginPassword.length < 8) {
                newErrors.loginPassword = "Password must be at least 8 characters";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && !forgotPasswordMode && !resetPasswordMode) {
            try {
                if (action === 'Signup') {
                    // Sign-up request to backend
                    await axios.post('http://localhost:8000/api/auth/signup', {
                        username: signupUserName,
                        phone: signupPhone,
                        email: signupEmail,
                        password: signupPassword,
                    });
                    navigate('/home');
                } else {
                    // Sign-in request to backend
                    await axios.post('http://localhost:8000/api/auth/signin', {
                        email: loginEmail,
                        password: loginPassword,
                    });
                    navigate('/home');
                }
            } catch (err) {
                console.error(err);
                setErrors({ server: 'Server error. Please try again later.' });
            }
        }
    };

    const handleForgotPasswordSubmit = async () => {
        if (!loginEmail || !validateEmail(loginEmail)) {
            setErrors({ loginEmail: "Valid email is required" });
        } else {
            try {
                // Forgot password API call
                const response = await axios.patch('http://localhost:8000/api/auth/send-forgot-password-code', {
                    email: loginEmail,
                });
                if (response.data.success) {
                    alert("Password reset link sent to your email!");
                    setForgotPasswordMode(false);  // Close Forgot Password mode after successful submission
                   setResetPasswordMode(true);  // Open Reset Password mode
                } else {
                    setErrors({ server: response.data.message || 'An error occurred. Please try again later.' });
                }
            } catch (err) {
                console.error(err);
                setErrors({ server: 'Server error. Please try again later.' });
            }
        }
    };

    const handleResetPasswordSubmit = async () => {
        if (!resetCode || !newPassword || !confirmNewPassword) {
            setErrors({ server: "All fields are required" });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setErrors({ server: "Passwords do not match" });
            return;
        }

        try {
            const { data } = await axios.patch('http://localhost:8000/api/auth/verify-forgot-password-code', {
                email: loginEmail,
                providedCode: resetCode,
                newPassword: newPassword,
            });

            if (data.success) {
                alert("Your password has been successfully reset!");
                navigate('/login');
            } else {
                setErrors({ server: data.message || 'An error occurred, please try again later' });
            }
        } catch (err) {
            console.error(err);
            setErrors({ server: 'Server error. Please try again later.' });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.text}>{forgotPasswordMode ? "Forgot Password" : resetPasswordMode ? "Reset Password" : action}</div>
                <div className={styles.underline}></div>
            </div>
            

            <div className={styles.inputs}>
                {forgotPasswordMode ? (
                    <div className={styles.input}>
                        <img src={email_icon} alt="" />
                        <input
                            type="email"
                            placeholder="Enter your email to reset password"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)} // Set loginEmail for the forgot password flow
                        />
                        {errors.loginEmail && <span className={styles.error}>{errors.loginEmail}</span>}
                    </div>
                ) : resetPasswordMode ? (
                    <>
                        <div className={styles.input}>
                            <input
                                type="text"
                                placeholder="Enter reset code"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                            />
                            {errors.server && <span className={styles.error}>{errors.server}</span>}
                        </div>
                        <div className={styles.input}>
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            {errors.server && <span className={styles.error}>{errors.server}</span>}
                        </div>
                        <div className={styles.input}>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            {errors.server && <span className={styles.error}>{errors.server}</span>}
                        </div>
                    </>
                ) : (
                    <>
                        {action === 'Signup' && (
                            <>
                                <div className={styles.input}>
                                    <img src={person_icon} alt="" />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={signupUserName}
                                        onChange={(e) => setSignupUserName(e.target.value)}
                                    />
                                    {errors.signupUserName && <span className={styles.error}>{errors.signupUserName}</span>}
                                </div>
                                <div className={styles.input}>
                                    <img src={email_icon} alt="" />
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        value={signupPhone}
                                        onChange={(e) => setSignupPhone(e.target.value)}
                                    />
                                    {errors.signupPhone && <span className={styles.error}>{errors.signupPhone}</span>}
                                </div>
                                <div className={styles.input}>
                                    <img src={email_icon} alt="" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                    />
                                    {errors.signupEmail && <span className={styles.error}>{errors.signupEmail}</span>}
                                </div>
                                <div className={styles.input}>
                                    <img src={password_icon} alt="" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                    />
                                    {errors.signupPassword && <span className={styles.error}>{errors.signupPassword}</span>}
                                </div>
                                <div className={styles.input}>
                                    <img src={password_icon} alt="" />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                                </div>
                            </>
                        )}

                        {action === 'Login' && (
                            <>
                                <div className={styles.input}>
                                    <img src={email_icon} alt="" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                    {errors.loginEmail && <span className={styles.error}>{errors.loginEmail}</span>}
                                </div>
                                <div className={styles.input}>
                                    <img src={password_icon} alt="" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                    {errors.loginPassword && <span className={styles.error}>{errors.loginPassword}</span>}
                                </div>
                                <div className={styles.forgot} onClick={() => setForgotPasswordMode(true)}>
                                    Forgot Password? <span>Click Here!</span>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className={styles.submit} onClick={resetPasswordMode ? handleResetPasswordSubmit : forgotPasswordMode ? handleForgotPasswordSubmit : handleSubmit}>
                {resetPasswordMode ? "Reset Password" : forgotPasswordMode ? "Send Code" : action === 'Login' ? 'Login' : 'Signup'}
            </div>

            <div className={styles.toggle} onClick={toggleAction}>
                {forgotPasswordMode || resetPasswordMode ? "" : action === 'Login' ? "Don't have an account? Signup" : "Already have an account? Login"}
            </div>
        </div>
        
    );
};

export default LoginSignup;
