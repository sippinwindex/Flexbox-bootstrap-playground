// js/learning/challenge-system.js

const ChallengeSystem = {
    challenges: new Map(),
    currentChallenge: null,
    challengeContainer: null,
    
    // Challenge definitions with enhanced features from file 1
    challengeDefinitions: [
        {
            id: 'flexbox-basics',
            title: 'Flexbox Fundamentals',
            category: 'layout',
            difficulty: 'beginner',
            description: 'Master the fundamentals of CSS Flexbox layout',
            icon: '🔧',
            estimatedTime: '10 minutes',
            prerequisites: [],
            objectives: [
                'Understand justify-content property',
                'Master align-items alignment',
                'Center elements perfectly with flexbox'
            ],
            instructions: [
                'Switch to the Layout tab',
                'Set display to flex',
                'Use justify-content: center',
                'Set align-items: center',
                'Observe how elements center perfectly'
            ],
            startingState: {
                layout: {
                    display: 'block',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch'
                }
            },
            successConditions: {
                layout: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            },
            hints: [
                'Flexbox is a one-dimensional layout method',
                'justify-content controls main axis alignment',
                'align-items controls cross axis alignment'
            ],
            resources: [
                'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
                'https://flexboxfroggy.com/'
            ]
        },
        
        {
            id: 'grid-mastery',
            title: 'CSS Grid Layout Mastery',
            category: 'layout',
            difficulty: 'intermediate',
            description: 'Create complex layouts with CSS Grid',
            icon: '📱',
            estimatedTime: '15 minutes',
            prerequisites: ['flexbox-basics'],
            objectives: [
                'Understand CSS Grid basics',
                'Create responsive grid layouts',
                'Master grid-template-areas'
            ],
            instructions: [
                'Switch display to grid',
                'Define grid columns with grid-template-columns',
                'Set gap between grid items',
                'Experiment with different grid sizes'
            ],
            startingState: {
                layout: {
                    display: 'flex'
                }
            },
            successConditions: {
                layout: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem'
                }
            },
            hints: [
                'Grid is two-dimensional unlike flexbox',
                'fr unit creates flexible track sizes',
                'gap property adds space between grid items'
            ]
        },
        
        {
            id: 'typography-hierarchy',
            title: 'Typography Hierarchy',
            category: 'typography',
            difficulty: 'beginner',
            description: 'Create clear visual hierarchy with typography',
            icon: '📝',
            estimatedTime: '12 minutes',
            prerequisites: [],
            objectives: [
                'Establish font size hierarchy',
                'Use font weights effectively',
                'Master line height for readability'
            ],
            instructions: [
                'Switch to Typography tab',
                'Create heading style (32px, bold)',
                'Set optimal line height (1.2 for headings)',
                'Adjust letter spacing for better readability'
            ],
            startingState: {
                typography: {
                    fontSize: '16',
                    fontWeight: '400',
                    lineHeight: '1.6'
                }
            },
            successConditions: {
                typography: {
                    fontSize: '32',
                    fontWeight: '700',
                    lineHeight: '1.2'
                }
            },
            hints: [
                'Larger text needs tighter line height',
                'Font weight creates visual importance',
                'Letter spacing affects readability'
            ]
        },
        
        {
            id: 'color-harmony',
            title: 'Color Harmony & Gradients',
            category: 'colors',
            difficulty: 'intermediate',
            description: 'Create beautiful color schemes and gradients',
            icon: '🎨',
            estimatedTime: '18 minutes',
            prerequisites: [],
            objectives: [
                'Understand color theory basics',
                'Create stunning gradients',
                'Ensure accessibility with proper contrast'
            ],
            instructions: [
                'Switch to Colors tab',
                'Create a linear gradient background',
                'Choose complementary colors',
                'Adjust opacity for subtle effects'
            ],
            startingState: {
                colors: {
                    bgType: 'solid',
                    bgColor: '#667eea'
                }
            },
            successConditions: {
                colors: {
                    bgType: 'linear-gradient',
                    gradientStart: '#667eea',
                    gradientEnd: '#764ba2'
                }
            },
            hints: [
                'Gradients add depth and interest',
                'Complementary colors create vibrant contrasts',
                'Always check color accessibility'
            ]
        },
        
        {
            id: 'shadow-mastery',
            title: 'Shadow & Depth Effects',
            category: 'effects',
            difficulty: 'intermediate',
            description: 'Master box shadows and visual depth',
            icon: '✨',
            estimatedTime: '20 minutes',
            prerequisites: ['color-harmony'],
            objectives: [
                'Create realistic shadows',
                'Understand shadow layering',
                'Build depth hierarchy with multiple shadows'
            ],
            instructions: [
                'Switch to Effects tab',
                'Create a subtle box shadow (0px 4px 15px)',
                'Experiment with shadow color and opacity',
                'Add multiple shadows for depth'
            ],
            startingState: {
                effects: {
                    shadowX: '0',
                    shadowY: '0',
                    shadowBlur: '0'
                }
            },
            successConditions: {
                effects: {
                    shadowX: '0',
                    shadowY: '4',
                    shadowBlur: '15',
                    shadowSpread: '0'
                }
            },
            hints: [
                'Subtle shadows feel more natural',
                'Vertical offset creates realistic lighting',
                'Blur creates soft, realistic edges'
            ]
        },
        
        {
            id: 'animation-fundamentals',
            title: 'CSS Animation Fundamentals',
            category: 'animations',
            difficulty: 'intermediate',
            description: 'Create smooth animations and transitions',
            icon: '🎬',
            estimatedTime: '25 minutes',
            prerequisites: ['shadow-mastery'],
            objectives: [
                'Understand keyframe animations',
                'Create smooth transitions',
                'Master animation timing functions'
            ],
            instructions: [
                'Switch to Animations tab',
                'Choose a pre-built animation',
                'Adjust timing and duration',
                'Experiment with different easing functions'
            ],
            startingState: {
                animations: {
                    type: 'none',
                    duration: '2',
                    timing: 'linear'
                }
            },
            successConditions: {
                animations: {
                    type: 'bounce',
                    duration: '1.5',
                    timing: 'ease-out'
                }
            },
            hints: [
                'Ease-out feels more natural for UI animations',
                'Shorter durations feel more responsive',
                'Choose animations that enhance UX'
            ]
        },
        
        {
            id: 'responsive-design',
            title: 'Responsive Design Principles',
            category: 'advanced',
            difficulty: 'advanced',
            description: 'Create layouts that work on all devices',
            icon: '📱',
            estimatedTime: '30 minutes',
            prerequisites: ['grid-mastery', 'typography-hierarchy'],
            objectives: [
                'Understand mobile-first design',
                'Use relative units effectively',
                'Create flexible layouts'
            ],
            instructions: [
                'Use relative units (rem, %, vw)',
                'Create flexible grid layouts',
                'Test on different screen sizes',
                'Optimize for touch interfaces'
            ],
            startingState: {
                layout: {
                    display: 'block'
                },
                typography: {
                    fontSize: '16'
                }
            },
            successConditions: {
                layout: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                },
                typography: {
                    fontSize: '1.125rem'
                }
            },
            hints: [
                'Mobile-first approach scales up better',
                'Relative units adapt to user preferences',
                'Auto-fit creates truly responsive grids'
            ]
        },
        
        {
            id: 'accessibility-first',
            title: 'Accessibility-First Design',
            category: 'advanced',
            difficulty: 'essential',
            description: 'Build inclusive designs for all users',
            icon: '♿',
            estimatedTime: '35 minutes',
            prerequisites: ['color-harmony'],
            objectives: [
                'Ensure sufficient color contrast',
                'Create keyboard-friendly interfaces',
                'Understand screen reader compatibility'
            ],
            instructions: [
                'Check color contrast ratios (4.5:1 minimum)',
                'Add focus states for interactive elements',
                'Use semantic HTML structure',
                'Test with screen reader tools'
            ],
            startingState: {
                colors: {
                    textColor: '#999999',
                    bgColor: '#cccccc'
                }
            },
            successConditions: {
                colors: {
                    textColor: '#000000',
                    bgColor: '#ffffff'
                }
            },
            hints: [
                'Accessibility benefits everyone',
                'High contrast improves readability',
                'Keyboard navigation is essential'
            ]
        }
    ],
    
    init() {
        console.log('🎯 Initializing Challenge System...');
        
        // Convert array to Map for efficient lookups
        this.challengeDefinitions.forEach(challenge => {
            this.challenges.set(challenge.id, challenge);
        });
        
        // Set up challenge container
        this.setupChallengeContainer();
        
        // Listen for state changes
        this.setupEventListeners();
        
        console.log(`✅ Challenge System initialized with ${this.challenges.size} challenges`);
        return this;
    },
    
    setupChallengeContainer() {
        // Create challenge overlay if it doesn't exist
        if (!document.getElementById('challenge-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'challenge-overlay';
            overlay.className = 'challenge-overlay';
            overlay.innerHTML = `
                <div class="challenge-modal">
                    <div class="challenge-header">
                        <h3 id="challenge-title"></h3>
                        <button class="challenge-close" onclick="ChallengeSystem.closeChallenge()">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="challenge-content" id="challenge-content">
                        <!-- Dynamic content -->
                    </div>
                    <div class="challenge-progress">
                        <div class="progress-bar" id="challenge-progress-bar"></div>
                    </div>
                    <div class="challenge-actions">
                        <button class="btn btn-secondary" onclick="ChallengeSystem.showHint()">
                            <i class="bi bi-lightbulb me-1"></i>Hint
                        </button>
                        <button class="btn btn-primary" onclick="ChallengeSystem.checkSolution()">
                            <i class="bi bi-check-circle me-1"></i>Check Solution
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        
        this.challengeContainer = document.getElementById('challenge-overlay');
    },
    
    setupEventListeners() {
        // Listen for property changes to check challenge progress
        AppState.on('propertyChanged', (category, property, value) => {
            if (this.currentChallenge) {
                this.checkProgress();
            }
        });
        
        // Listen for tab changes
        AppState.on('tabChanged', (newTab) => {
            if (this.currentChallenge && this.currentChallenge.category !== newTab) {
                this.updateChallengeGuide(newTab);
            }
        });
    },
    
    startChallenge(challengeId) {
        const challenge = this.challenges.get(challengeId);
        if (!challenge) {
            console.error(`Challenge ${challengeId} not found`);
            return false;
        }
        
        // Check prerequisites
        if (!this.checkPrerequisites(challenge)) {
            Toast.show(`Complete prerequisite challenges first: ${challenge.prerequisites.join(', ')}`, 'warning');
            return false;
        }
        
        this.currentChallenge = challenge;
        
        // Apply starting state
        this.applyStartingState(challenge);
        
        // Switch to appropriate tab
        if (challenge.category !== AppState.getCurrentTab()) {
            Tabs.switchTab(challenge.category);
        }
        
        // Show challenge modal
        this.showChallengeModal(challenge);
        
        // Track challenge start
        AppState.emit('challengeStarted', challengeId);
        
        Toast.show(`Started challenge: ${challenge.title}`, 'info');
        return true;
    },
    
    checkPrerequisites(challenge) {
        return challenge.prerequisites.every(prereq => 
            AppState.isChallengeCompleted(prereq)
        );
    },
    
    applyStartingState(challenge) {
        Object.entries(challenge.startingState).forEach(([category, properties]) => {
            Object.entries(properties).forEach(([property, value]) => {
                AppState.setPropertyValue(category, property, value);
                
                // Update UI controls
                const element = document.getElementById(`${category}-${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
                if (element) {
                    element.value = value;
                    if (element.type === 'range') {
                        const unit = this.getPropertyUnit(property);
                        Utils.updateRangeValue(element.id, unit);
                    }
                }
            });
        });
        
        // Update demo
        DemoManager.updateDemo(challenge.category);
    },
    
    showChallengeModal(challenge) {
        const titleEl = document.getElementById('challenge-title');
        const contentEl = document.getElementById('challenge-content');
        
        titleEl.innerHTML = `
            <span class="challenge-icon">${challenge.icon}</span>
            ${challenge.title}
            <span class="challenge-difficulty badge bg-${this.getDifficultyColor(challenge.difficulty)}">
                ${challenge.difficulty}
            </span>
        `;
        
        contentEl.innerHTML = `
            <div class="challenge-description">
                <p>${challenge.description}</p>
                <p class="text-muted">
                    <i class="bi bi-clock me-1"></i>Estimated time: ${challenge.estimatedTime}
                </p>
            </div>
            
            <div class="challenge-objectives">
                <h6><i class="bi bi-target me-2"></i>Learning Objectives</h6>
                <ul>
                    ${challenge.objectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>
            
            <div class="challenge-instructions">
                <h6><i class="bi bi-list-check me-2"></i>Instructions</h6>
                <ol id="instruction-list">
                    ${challenge.instructions.map((instruction, index) => 
                        `<li id="instruction-${index}" class="instruction-item">${instruction}</li>`
                    ).join('')}
                </ol>
            </div>
            
            <div class="challenge-hints" id="challenge-hints" style="display: none;">
                <h6><i class="bi bi-lightbulb me-2"></i>Hints</h6>
                <div id="hint-content"></div>
            </div>
        `;
        
        this.challengeContainer.style.display = 'flex';
        this.updateProgress(0);
    },
    
    checkProgress() {
        if (!this.currentChallenge) return;
        
        const challenge = this.currentChallenge;
        let completedConditions = 0;
        let totalConditions = 0;
        
        Object.entries(challenge.successConditions).forEach(([category, conditions]) => {
            Object.entries(conditions).forEach(([property, expectedValue]) => {
                totalConditions++;
                const currentValue = AppState.getPropertyValue(category, property);
                if (currentValue === expectedValue) {
                    completedConditions++;
                    this.markInstructionComplete(property);
                }
            });
        });
        
        const progress = (completedConditions / totalConditions) * 100;
        this.updateProgress(progress);
        
        if (progress === 100) {
            this.completeChallenge();
        }
    },
    
    markInstructionComplete(property) {
        // Find and mark relevant instruction as complete
        const instructions = document.querySelectorAll('.instruction-item');
        instructions.forEach(instruction => {
            if (instruction.textContent.toLowerCase().includes(property.toLowerCase())) {
                instruction.classList.add('instruction-complete');
            }
        });
    },
    
    updateProgress(percentage) {
        const progressBar = document.getElementById('challenge-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
        }
    },
    
    showHint() {
        if (!this.currentChallenge) return;
        
        const hintsContainer = document.getElementById('challenge-hints');
        const hintContent = document.getElementById('hint-content');
        
        if (this.currentChallenge.hintIndex === undefined) {
            this.currentChallenge.hintIndex = 0;
        }
        
        const hint = this.currentChallenge.hints[this.currentChallenge.hintIndex];
        if (hint) {
            hintContent.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-lightbulb me-2"></i>${hint}
                </div>
            `;
            hintsContainer.style.display = 'block';
            this.currentChallenge.hintIndex++;
        } else {
            hintContent.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-info-circle me-2"></i>No more hints available. Try experimenting with the controls!
                </div>
            `;
        }
    },
    
    checkSolution() {
        if (!this.currentChallenge) return;
        
        const challenge = this.currentChallenge;
        let isComplete = true;
        let feedback = [];
        
        Object.entries(challenge.successConditions).forEach(([category, conditions]) => {
            Object.entries(conditions).forEach(([property, expectedValue]) => {
                const currentValue = AppState.getPropertyValue(category, property);
                if (currentValue !== expectedValue) {
                    isComplete = false;
                    feedback.push(`${property} should be ${expectedValue}, but is ${currentValue}`);
                }
            });
        });
        
        if (isComplete) {
            this.completeChallenge();
        } else {
            this.showFeedback(feedback);
        }
    },
    
    showFeedback(feedback) {
        const feedbackHtml = `
            <div class="alert alert-warning">
                <h6><i class="bi bi-exclamation-triangle me-2"></i>Not quite there yet!</h6>
                <ul class="mb-0">
                    ${feedback.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Insert feedback before actions
        const actionsEl = document.querySelector('.challenge-actions');
        actionsEl.insertAdjacentHTML('beforebegin', feedbackHtml);
        
        // Remove feedback after 5 seconds
        setTimeout(() => {
            const alertEl = document.querySelector('.alert-warning');
            if (alertEl) alertEl.remove();
        }, 5000);
    },
    
    completeChallenge() {
        if (!this.currentChallenge) return;
        
        const challengeId = this.currentChallenge.id;
        const challenge = this.currentChallenge;
        
        // Mark as completed in app state
        const wasNewCompletion = AppState.completeChallenge(challengeId);
        
        if (wasNewCompletion) {
            // Show success modal
            this.showSuccessModal(challenge);
            
            // Update UI
            this.updateProgress(100);
            
            // Play celebration animation
            this.playCelebrationAnimation();
            
            Toast.show(`🎉 Challenge completed: ${challenge.title}!`, 'success');
        }
    },
    
    showSuccessModal(challenge) {
        const contentEl = document.getElementById('challenge-content');
        contentEl.innerHTML = `
            <div class="challenge-success">
                <div class="success-animation">
                    <i class="bi bi-check-circle-fill text-success"></i>
                </div>
                <h4>🎉 Challenge Completed!</h4>
                <p>Congratulations! You've mastered <strong>${challenge.title}</strong></p>
                
                <div class="success-stats">
                    <div class="stat">
                        <span class="stat-number">${AppState.learningProgress.completedChallenges.size}</span>
                        <span class="stat-label">Challenges Completed</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${AppState.learningProgress.progressPercentage}%</span>
                        <span class="stat-label">Overall Progress</span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h6>What's Next?</h6>
                    ${this.getNextChallengeRecommendations(challenge)}
                </div>
                
                <div class="resources">
                    <h6>Additional Resources</h6>
                    <ul>
                        ${challenge.resources.map(resource => 
                            `<li><a href="${resource}" target="_blank" rel="noopener">${this.getResourceTitle(resource)}</a></li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        // Update action buttons
        const actionsEl = document.querySelector('.challenge-actions');
        actionsEl.innerHTML = `
            <button class="btn btn-success" onclick="ChallengeSystem.closeChallenge()">
                <i class="bi bi-check me-1"></i>Continue Learning
            </button>
            <button class="btn btn-outline-primary" onclick="ChallengeSystem.retryChallenge()">
                <i class="bi bi-arrow-repeat me-1"></i>Try Again
            </button>
        `;
    },
    
    getNextChallengeRecommendations(completedChallenge) {
        const nextChallenges = Array.from(this.challenges.values())
            .filter(challenge => 
                !AppState.isChallengeCompleted(challenge.id) &&
                this.checkPrerequisites(challenge)
            )
            .slice(0, 3);
        
        if (nextChallenges.length === 0) {
            return '<p>🎓 Congratulations! You\'ve completed all available challenges!</p>';
        }
        
        return `
            <div class="next-challenges">
                ${nextChallenges.map(challenge => `
                    <div class="next-challenge-card" onclick="ChallengeSystem.startChallenge('${challenge.id}')">
                        <span class="challenge-icon">${challenge.icon}</span>
                        <div class="challenge-info">
                            <strong>${challenge.title}</strong>
                            <small class="text-muted">${challenge.difficulty}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    getResourceTitle(url) {
        if (url.includes('css-tricks.com')) return 'CSS-Tricks Guide';
        if (url.includes('flexboxfroggy.com')) return 'Flexbox Froggy Game';
        if (url.includes('cssgridgarden.com')) return 'CSS Grid Garden';
        if (url.includes('developer.mozilla.org')) return 'MDN Documentation';
        return 'External Resource';
    },
    
    playCelebrationAnimation() {
        // Create confetti effect
        const confetti = document.createElement('div');
        confetti.className = 'celebration-confetti';
        confetti.innerHTML = '🎉🎊✨🌟💫';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    },
    
    closeChallenge() {
        this.currentChallenge = null;
        if (this.challengeContainer) {
            this.challengeContainer.style.display = 'none';
        }
    },
    
    retryChallenge() {
        if (this.currentChallenge) {
            const challengeId = this.currentChallenge.id;
            this.closeChallenge();
            setTimeout(() => {
                this.startChallenge(challengeId);
            }, 100);
        }
    },
    
    getDifficultyColor(difficulty) {
        const colors = {
            beginner: 'success',
            intermediate: 'warning',
            advanced: 'danger',
            essential: 'info'
        };
        return colors[difficulty] || 'secondary';
    },
    
    getPropertyUnit(property) {
        const units = {
            fontSize: 'px',
            letterSpacing: 'px',
            shadowX: 'px',
            shadowY: 'px',
            shadowBlur: 'px',
            shadowSpread: 'px',
            rotate: 'deg',
            translateX: 'px',
            translateY: 'px',
            duration: 's',
            transitionDuration: 's',
            brightness: '%',
            contrast: '%',
            saturation: '%',
            hueRotate: 'deg',
            sepia: '%'
        };
        return units[property] || '';
    },
    
    updateChallengeGuide(newTab) {
        // Update challenge guide when user switches tabs
        if (this.currentChallenge && this.currentChallenge.category === newTab) {
            Toast.show('✅ Great! You\'re on the right tab for this challenge.', 'success');
        } else if (this.currentChallenge) {
            Toast.show(`💡 Switch to the ${this.currentChallenge.category} tab to continue the challenge.`, 'info');
        }
    },
    
    // Public API methods
    getAllChallenges() {
        return Array.from(this.challenges.values());
    },
    
    getChallengesByCategory(category) {
        return Array.from(this.challenges.values())
            .filter(challenge => challenge.category === category);
    },
    
    getChallengesByDifficulty(difficulty) {
        return Array.from(this.challenges.values())
            .filter(challenge => challenge.difficulty === difficulty);
    },
    
    getAvailableChallenges() {
        return Array.from(this.challenges.values())
            .filter(challenge => 
                !AppState.isChallengeCompleted(challenge.id) &&
                this.checkPrerequisites(challenge)
            );
    },
    
    getCompletedChallenges() {
        return Array.from(this.challenges.values())
            .filter(challenge => AppState.isChallengeCompleted(challenge.id));
    },
    
    getCurrentChallenge() {
        return this.currentChallenge;
    },
    
    getChallengeProgress() {
        const total = this.challenges.size;
        const completed = AppState.learningProgress.completedChallenges.size;
        return {
            total,
            completed,
            percentage: Math.round((completed / total) * 100),
            remaining: total - completed
        };
    }
};

// Make globally available
window.ChallengeSystem = ChallengeSystem;