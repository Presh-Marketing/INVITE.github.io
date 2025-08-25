let currentQuestion = 1;
const totalQuestions = 6;
let answers = {};

// Initialize quiz
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    attachEventListeners();
});

function attachEventListeners() {
    // Add event listeners to all radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Store the answer
            answers[this.name] = parseInt(this.value);
            
            // Auto-advance after a short delay
            setTimeout(() => {
                if (currentQuestion < totalQuestions) {
                    nextQuestion();
                } else {
                    showResults();
                }
            }, 700);
        });
    });
}

function nextQuestion() {
    // Hide current question
    const currentSlide = document.querySelector('.question-slide.active');
    currentSlide.style.opacity = '0';
    currentSlide.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        currentSlide.classList.remove('active');
        
        // Show next question
        currentQuestion++;
        const nextSlide = document.querySelector(`[data-question="${currentQuestion}"]`);
        if (nextSlide) {
            nextSlide.classList.add('active');
            updateProgress();
        }
    }, 300);
}

function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Question ${currentQuestion} of ${totalQuestions}`;
}

function calculateScore() {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    return (totalScore / totalQuestions).toFixed(1);
}

function getResultData(score) {
    const numScore = parseFloat(score);
    
    if (numScore >= 0 && numScore <= 2.4) {
        return {
            title: '🔴 Infrastructure Friction (Score: ' + score + '/5.0)',
            description: 'You\'re in the bottom 25% of organizations for AI readiness. Key gaps: GPU bottlenecks, network latency, and security vulnerabilities are limiting your AI ROI. Priority: Establish validated architecture foundations.',
            className: 'score-not-ready',
            recommendations: [
                'Start with Cisco UCS C885A + NVIDIA HGX for dedicated AI compute',
                'Implement fabric-aware networking (Nexus 9000) to eliminate bottlenecks',
                'Deploy AI-native security (Cisco AI Defense) to protect model integrity'
            ]
        };
    } else if (numScore >= 2.5 && numScore <= 3.4) {
        return {
            title: '🟠 Progress with Gaps (Score: ' + score + '/5.0)',
            description: 'You\'re ahead of 40% of organizations but infrastructure bottlenecks are limiting scale. You have foundations but need enterprise-grade optimization to support production AI workloads.',
            className: 'score-emerging',
            recommendations: [
                'Upgrade to integrated AI fabric architecture for consistent performance',
                'Add workload observability and automated scaling capabilities',
                'Implement managed AI infrastructure to accelerate time-to-value'
            ]
        };
    } else if (numScore >= 3.5 && numScore <= 4.2) {
        return {
            title: '🟡 Built for Scale (Score: ' + score + '/5.0)',
            description: 'You\'re in the top 30% of organizations for AI infrastructure maturity. You have enterprise-grade foundations and understand the importance of validated architecture.',
            className: 'score-capable',
            recommendations: [
                'Optimize east-west traffic patterns for multi-GPU training workloads',
                'Add comprehensive AI security posture management',
                'Consider managed services to focus internal resources on innovation'
            ]
        };
    } else {
        return {
            title: '🟢 AI-Ready Excellence (Score: ' + score + '/5.0)',
            description: 'You\'re in the top 10% of organizations for AI infrastructure readiness. You understand that enterprise AI requires validated architecture, security-first design, and expert lifecycle management.',
            className: 'score-ready',
            recommendations: [
                'Focus on advanced AI workload optimization and model governance',
                'Explore edge AI deployment and hybrid cloud strategies',
                'Consider strategic partnership for next-generation AI initiatives'
            ]
        };
    }
}

function showResults() {
    // Hide current question and progress
    const currentSlide = document.querySelector('.question-slide.active');
    currentSlide.style.opacity = '0';
    currentSlide.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        currentSlide.classList.remove('active');
        document.querySelector('.progress-container').style.display = 'none';
        
        // Calculate and display results
        const score = calculateScore();
        const resultData = getResultData(score);
        
        document.getElementById('scoreCircle').textContent = score;
        document.getElementById('scoreCircle').className = `score-circle ${resultData.className}`;
        document.getElementById('resultTitle').textContent = resultData.title;
        document.getElementById('resultDescription').textContent = resultData.description;
        
        // Populate recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
        resultData.recommendations.forEach((rec, index) => {
            const li = document.createElement('li');
            li.style.cssText = `
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                margin-bottom: 1rem;
                padding: 1rem;
                background: white;
                border-radius: 8px;
                border-left: 3px solid #4EABCB;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            `;
            li.innerHTML = `
                <span style="background: #4EABCB; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;">${index + 1}</span>
                <span style="color: #333; font-size: 1rem; line-height: 1.5;">${rec}</span>
            `;
            recommendationsList.appendChild(li);
        });
        
        // Add benchmark text
        const benchmarkText = document.getElementById('benchmarkText');
        const numScore = parseFloat(score);
        if (numScore <= 2.4) {
            benchmarkText.textContent = "Based on our assessment of 500+ enterprise AI initiatives, organizations with your profile typically see 40-60% improvement in AI project success rates after implementing validated architecture.";
        } else if (numScore <= 3.4) {
            benchmarkText.textContent = "Organizations at your maturity level typically achieve 2-3x faster AI deployment cycles and 35% better model performance with optimized infrastructure.";
        } else if (numScore <= 4.2) {
            benchmarkText.textContent = "You're ahead of 70% of enterprises in AI infrastructure maturity. Companies at your level typically focus on advanced optimization and strategic AI initiatives.";
        } else {
            benchmarkText.textContent = "You're in the top 10% of enterprises for AI infrastructure readiness. Organizations at your level typically serve as industry benchmarks and case studies.";
        }
        
        // Show results container with animation
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.classList.add('active');

        // Store score for potential form submission
        window.quizScore = score;
        window.quizAnswers = answers;
        window.quizResultData = resultData;
    }, 300);
}

function showLeadForm() {
    const leadForm = document.getElementById('leadForm');
    leadForm.classList.add('active');
    document.querySelector('.show-form-button').style.display = 'none';
    
    // Scroll to form smoothly
    setTimeout(() => {
        leadForm.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const leadData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        company: formData.get('company'),
        title: formData.get('title'),
        phone: formData.get('phone'),
        quizScore: window.quizScore,
        quizAnswers: window.quizAnswers,
        timestamp: new Date().toISOString()
    };

    // HubSpot integration would go here
    // Example HubSpot form submission:
    /*
    const hubspotFormData = new FormData();
    hubspotFormData.append('firstname', leadData.firstName);
    hubspotFormData.append('lastname', leadData.lastName);
    hubspotFormData.append('email', leadData.email);
    hubspotFormData.append('company', leadData.company);
    hubspotFormData.append('jobtitle', leadData.title);
    hubspotFormData.append('phone', leadData.phone);
    hubspotFormData.append('ai_readiness_score', leadData.quizScore);
    
    fetch('https://api.hsforms.com/submissions/v3/integration/submit/YOUR_PORTAL_ID/YOUR_FORM_ID', {
        method: 'POST',
        body: hubspotFormData
    });
    */

    console.log('Lead data ready for HubSpot:', leadData);
    
    // Analytics tracking would go here
    // Example Google Analytics 4 tracking:
    /*
    gtag('event', 'form_submit', {
        event_category: 'AI Readiness Quiz',
        event_label: 'Lead Capture',
        value: parseFloat(window.quizScore),
        custom_parameters: {
            company: leadData.company,
            job_title: leadData.title,
            score_category: getResultData(window.quizScore).title
        }
    });
    */

    // Simulate form submission with enhanced UX
    const submitButton = event.target.querySelector('.cta-button');
    const originalText = submitButton.textContent;
    const originalHTML = submitButton.innerHTML;
    
    submitButton.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <span style="animation: spin 1s linear infinite; display: inline-block;">⏳</span>
            Scheduling Your Session...
        </span>
    `;
    submitButton.disabled = true;
    submitButton.style.opacity = '0.8';

    // Add spinning animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        // Success state
        submitButton.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                ✅ Session Scheduled Successfully!
            </span>
        `;
        submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        submitButton.style.opacity = '1';
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            margin-top: 1.5rem;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        `;
        successMessage.innerHTML = `
            <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem;">🎉 Thank You!</h4>
            <p style="margin: 0; opacity: 0.95;">Your AI Readiness Session has been scheduled. Our experts will contact you within 24 hours to confirm your appointment and discuss next steps for your infrastructure.</p>
        `;
        
        event.target.appendChild(successMessage);
        
        // In a real implementation, redirect to a thank you page after a delay
        // setTimeout(() => {
        //     window.location.href = '/thank-you?score=' + window.quizScore;
        // }, 3000);
        
    }, 2500);
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && currentQuestion <= totalQuestions) {
        const activeQuestion = document.querySelector('.question-slide.active');
        if (activeQuestion) {
            const checkedRadio = activeQuestion.querySelector('input[type="radio"]:checked');
            if (checkedRadio) {
                checkedRadio.dispatchEvent(new Event('change'));
            }
        }
    }
});

// Add number key shortcuts (1-5) for quick answer selection
document.addEventListener('keydown', function(event) {
    const num = parseInt(event.key);
    if (num >= 1 && num <= 5 && currentQuestion <= totalQuestions) {
        const activeQuestion = document.querySelector('.question-slide.active');
        if (activeQuestion) {
            const targetRadio = activeQuestion.querySelector(`input[value="${num}"]`);
            if (targetRadio) {
                targetRadio.checked = true;
                targetRadio.dispatchEvent(new Event('change'));
            }
        }
    }
});
