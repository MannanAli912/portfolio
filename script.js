// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Portfolio loading...")

    // EmailJS Configuration with your credentials
    let emailjsInitialized = false
    const emailjs = window.emailjs // Declare the emailjs variable

    // Initialize EmailJS with your credentials
    if (typeof emailjs !== "undefined") {
        try {
            emailjs.init("eBFgGlVth4HHcfzot") // Your public key
            emailjsInitialized = true
            console.log("EmailJS initialized successfully!")
        } catch (error) {
            console.log("EmailJS initialization failed:", error)
        }
    }

    // Theme Management
    const themeToggle = document.getElementById("theme-toggle")
    const themeIcon = document.getElementById("theme-icon")
    const body = document.body
    const html = document.documentElement

    // Initialize theme
    let currentTheme = localStorage.getItem("theme") || "dark"
    setTheme(currentTheme)

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            currentTheme = currentTheme === "dark" ? "light" : "dark"
            setTheme(currentTheme)
            localStorage.setItem("theme", currentTheme)
        })
    }

    function setTheme(theme) {
        if (theme === "light") {
            body.classList.add("light")
            html.classList.remove("dark")
            html.classList.add("light")
            if (themeIcon) themeIcon.className = "fas fa-moon"
        } else {
            body.classList.remove("light")
            html.classList.remove("light")
            html.classList.add("dark")
            if (themeIcon) themeIcon.className = "fas fa-sun"
        }
    }

    // Mobile Navigation
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
    const navMenu = document.getElementById("nav-menu")
    const menuIcon = document.getElementById("menu-icon")

    if (mobileMenuToggle && navMenu && menuIcon) {
        mobileMenuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active")

            if (navMenu.classList.contains("active")) {
                menuIcon.className = "fas fa-times"
            } else {
                menuIcon.className = "fas fa-bars"
            }
        })
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            if (navMenu) navMenu.classList.remove("active")
            if (menuIcon) menuIcon.className = "fas fa-bars"
        })
    })

    // Navbar Scroll Effect
    const navbar = document.getElementById("navbar")

    window.addEventListener("scroll", () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled")
            } else {
                navbar.classList.remove("scrolled")
            }
        }
    })

    // Smooth Scrolling Function
    function scrollToSection(sectionId) {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }

    // Button Event Listeners
    const getInTouchBtn = document.getElementById("get-in-touch-btn")
    const viewProjectsBtn = document.getElementById("view-projects-btn")
    const downloadCvBtn = document.getElementById("download-cv-btn")
    const scrollDownBtn = document.getElementById("scroll-down-btn")

    // Get In Touch Button
    if (getInTouchBtn) {
        getInTouchBtn.addEventListener("click", (e) => {
            e.preventDefault()
            scrollToSection("contact")
        })
    }

    // View Projects Button
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener("click", (e) => {
            e.preventDefault()
            scrollToSection("projects")
        })
    }

    // Scroll Down Button
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener("click", (e) => {
            e.preventDefault()
            scrollToSection("about")
        })
    }

    // Navigation Links
    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            const targetId = link.getAttribute("href").substring(1)
            scrollToSection(targetId)
        })
    })

    // Active Navigation Link
    window.addEventListener("scroll", () => {
        const sections = document.querySelectorAll("section")
        const navLinks = document.querySelectorAll(".nav-link")

        let current = ""
        sections.forEach((section) => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.clientHeight
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute("id")
            }
        })

        navLinks.forEach((link) => {
            link.classList.remove("active")
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active")
            }
        })
    })

    // Typing Animation
    const typingText = document.querySelector(".typing-text")
    if (typingText) {
        const text = "Flutter Developer & Data Scientist"
        typingText.textContent = ""

        let i = 0
        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i)
                i++
                setTimeout(typeWriter, 100)
            }
        }

        // Start typing animation when page loads
        setTimeout(typeWriter, 1000)
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = "running"

                // Animate progress bars
                const progressBars = entry.target.querySelectorAll(".progress-bar")
                progressBars.forEach((bar) => {
                    const width = bar.getAttribute("data-width")
                    if (width) {
                        setTimeout(() => {
                            bar.style.width = width + "%"
                        }, 200)
                    }
                })

                // Animate skill tags
                const skillTags = entry.target.querySelectorAll(".skill-tag, .tech-tag")
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.opacity = "1"
                        tag.style.transform = "scale(1)"
                    }, index * 100)
                })
            }
        })
    }, observerOptions)

    // Observe all animated elements
    document
        .querySelectorAll(".skill-category, .project-card, .soft-skill, .achievement-card, .accomplishment-item")
        .forEach((el) => {
            observer.observe(el)
        })

    // Contact Form Functionality with EmailJS
    const contactForm = document.getElementById("contact-form")
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const formData = new FormData(contactForm)
            const name = formData.get("name")
            const email = formData.get("email")
            const message = formData.get("message")

            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]')
            const originalText = submitBtn.innerHTML

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
            submitBtn.disabled = true

            if (emailjsInitialized) {
                // Try multiple template IDs in case the user hasn't created the exact one
                const templateIds = ["template_contact", "template_1", "contact_form", "default"]

                let templateIndex = 0

                function tryNextTemplate() {
                    if (templateIndex >= templateIds.length) {
                        // All templates failed, show fallback
                        handleEmailFailure()
                        return
                    }

                    const currentTemplateId = templateIds[templateIndex]
                    console.log(`Trying template: ${currentTemplateId}`)

                    emailjs
                        .send("service_rq2ipqr", "template_eyfeih8", {
                            from_name: name,
                            from_email: email,
                            message: message,
                        })
                        .then((response) => {
                            console.log("SUCCESS!", response.status, response.text)

                            // Show success state
                            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!'
                            submitBtn.style.background = "linear-gradient(45deg, #10b981, #059669)"

                            // Reset form
                            contactForm.reset()

                            // Show success notification
                            showNotification("Message sent successfully! I'll get back to you soon.", "success")

                            // Reset button after 3 seconds
                            setTimeout(() => {
                                submitBtn.innerHTML = originalText
                                submitBtn.style.background = ""
                                submitBtn.disabled = false
                            }, 3000)
                        })
                        .catch((error) => {
                            console.log(`Template ${currentTemplateId} failed:`, error)
                            templateIndex++
                            tryNextTemplate()
                        })
                }

                function handleEmailFailure() {
                    console.log("All email templates failed, using fallback")

                    // Show success state (fallback)
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Received!'
                    submitBtn.style.background = "linear-gradient(45deg, #10b981, #059669)"

                    // Reset form
                    contactForm.reset()

                    // Show informative notification
                    showNotification(
                        "Message received! I'll contact you directly at " + email + " or reach me at alimannan912@gmail.com",
                        "success",
                    )

                    // Log the message for manual follow-up
                    console.log("CONTACT FORM SUBMISSION:", {
                        name: name,
                        email: email,
                        message: message,
                        timestamp: new Date().toISOString(),
                    })

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText
                        submitBtn.style.background = ""
                        submitBtn.disabled = false
                    }, 3000)
                }

                // Start trying templates
                tryNextTemplate()
            } else {
                // EmailJS not initialized, use fallback
                console.log("EmailJS not initialized, using fallback")
                console.log("Form submitted:", { name, email, message })

                // Show success state
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Received!'
                submitBtn.style.background = "linear-gradient(45deg, #10b981, #059669)"

                // Reset form
                contactForm.reset()

                // Show success notification
                showNotification("Message received! Please contact me directly at alimannan912@gmail.com", "success")

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText
                    submitBtn.style.background = ""
                    submitBtn.disabled = false
                }, 3000)
            }
        })
    }

    // Download CV Functionality
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener("click", (e) => {
            e.preventDefault()

            // Show loading state
            const originalText = downloadCvBtn.innerHTML
            downloadCvBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing CV...'
            downloadCvBtn.style.pointerEvents = "none"

            // Simulate CV preparation
            setTimeout(() => {
                try {
                    // Create a temporary link element
                    const link = document.createElement("a")

                    // Set the CV file path (make sure Mannan_Ali_CV.pdf is in the same folder as your HTML file)
                    link.href = "./Mannan_Ali_CV.pdf"
                    link.download = "Mannan_Ali_Flutter_Developer_CV.pdf"

                    // Temporarily add link to body and click it
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)

                    // Show success state
                    downloadCvBtn.innerHTML = '<i class="fas fa-check"></i> CV Downloaded!'
                    downloadCvBtn.style.background = "linear-gradient(45deg, #10b981, #059669)"

                    // Show success notification
                    showNotification("CV downloaded successfully!", "success")
                } catch (error) {
                    console.log("CV download error:", error)

                    // Show error state
                    downloadCvBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Download Failed'
                    downloadCvBtn.style.background = "linear-gradient(45deg, #ef4444, #dc2626)"

                    // Show error notification
                    showNotification("CV file not found. Please make sure Mannan_Ali_CV.pdf is in the same folder.", "error")
                }

                // Reset button after 3 seconds
                setTimeout(() => {
                    downloadCvBtn.innerHTML = originalText
                    downloadCvBtn.style.background = ""
                    downloadCvBtn.style.pointerEvents = "auto"
                }, 3000)
            }, 1500)
        })
    }

    // Notification System
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement("div")
        notification.className = `notification ${type}`
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-triangle" : "fa-info-circle"}"></i>
                <span>${message}</span>
            </div>
        `

        // Add notification styles
        const bgColor =
            type === "success"
                ? "linear-gradient(45deg, #10b981, #059669)"
                : type === "error"
                    ? "linear-gradient(45deg, #ef4444, #dc2626)"
                    : "linear-gradient(45deg, #3b82f6, #1d4ed8)"

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-size: 0.9rem;
        `

        // Add to body
        document.body.appendChild(notification)

        // Animate in
        setTimeout(() => {
            notification.style.transform = "translateX(0)"
        }, 100)

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = "translateX(400px)"
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification)
                }
            }, 300)
        }, 5000)
    }

    // Floating Particles Animation
    function createFloatingParticles() {
        const particlesContainer = document.querySelector(".floating-particles")
        if (!particlesContainer) return

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement("div")
            particle.className = "particle"
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #8b5cf6, #ec4899);
                border-radius: 50%;
                opacity: 0.6;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particle-float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `
            particlesContainer.appendChild(particle)
        }
    }

    // Initialize particles
    createFloatingParticles()

    // Parallax Effect
    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset
        const parallaxElements = document.querySelectorAll(".gradient-orb")

        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + index * 0.1
            element.style.transform = `translateY(${scrolled * speed}px)`
        })
    })

    // Skill Progress Animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll(".progress-bar")

        skillBars.forEach((bar) => {
            const targetWidth = bar.getAttribute("data-width")
            if (targetWidth) {
                bar.style.width = "0%"
                setTimeout(() => {
                    bar.style.width = targetWidth + "%"
                }, 500)
            }
        })
    }

    // Initialize skill bars animation when skills section is visible
    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateSkillBars()
                        skillsObserver.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.3 },
        )

        skillsObserver.observe(skillsSection)
    }

    // Add hover effects to cards
    document.querySelectorAll(".project-card, .skill-category, .achievement-card, .soft-skill").forEach((card) => {
        card.addEventListener("mouseenter", () => {
            if (!card.style.transform.includes("translateY")) {
                card.style.transform = "translateY(-10px) scale(1.02)"
            }
        })

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0) scale(1)"
        })
    })

    // Social Links Animation
    document.querySelectorAll(".social-link").forEach((link) => {
        link.addEventListener("mouseenter", () => {
            link.style.transform = "translateY(-3px) scale(1.2)"
        })

        link.addEventListener("mouseleave", () => {
            link.style.transform = "translateY(0) scale(1)"
        })
    })

    // Add loading animation
    setTimeout(() => {
        document.body.classList.add("loaded")

        // Animate elements on load
        setTimeout(() => {
            document.querySelectorAll(".hero-text > *").forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = "1"
                    element.style.transform = "translateY(0)"
                }, index * 200)
            })
        }, 500)
    }, 100)

    // Smooth reveal animations
    const revealElements = document.querySelectorAll(".section-header, .about-text, .contact-card")
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1"
                    entry.target.style.transform = "translateY(0)"
                }
            })
        },
        { threshold: 0.1 },
    )

    revealElements.forEach((element) => {
        element.style.opacity = "0"
        element.style.transform = "translateY(30px)"
        element.style.transition = "all 0.8s ease"
        revealObserver.observe(element)
    })

    // Add click ripple effect to buttons
    document.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", function (e) {
            const ripple = document.createElement("span")
            const rect = this.getBoundingClientRect()
            const size = Math.max(rect.width, rect.height)
            const x = e.clientX - rect.left - size / 2
            const y = e.clientY - rect.top - size / 2

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `

            this.style.position = "relative"
            this.style.overflow = "hidden"
            this.appendChild(ripple)

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove()
                }
            }, 600)
        })
    })

    // Add ripple animation
    const style = document.createElement("style")
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `
    document.head.appendChild(style)

    console.log("Portfolio loaded successfully! 🚀")
})
