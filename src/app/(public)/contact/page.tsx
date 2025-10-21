'use client';

// src/app/(public)/contact/page.tsx

import React, { useState } from 'react';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here, e.g., sending data to API
        alert('Message sent!');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-lightGray text-navy px-5 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-primary text-center mb-8">Contact Us</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg text-navy"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg text-navy"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-2" htmlFor="subject">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg text-navy"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg text-navy h-32 resize-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-accent transition duration-300"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
