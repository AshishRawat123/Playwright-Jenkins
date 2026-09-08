pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm ci'
            }
        }

        stage('Install Playwright') {
            steps {
                echo 'Installing Playwright browsers...'
                bat 'npx playwright install'
            }
        }

        stage('Run UI Tests') {
             steps {
                withCredentials([
                    file(
                        credentialsId: 'PLAYWRIGHT_SECRET_FILE',
                        variable: 'ENV_FILE'
                    )
                ]) {
                    bat 'npx playwright test --project=ui'
                }
            }
        }
        stage('Run API Tests') {
             steps {
                {
                    bat 'npx playwright test --project=api'
                }
            }
        }
    }

    post {
        always {
            echo 'Playwright pipeline completed.'
        }

        success {
            echo 'Playwright tests passed!'
        }

        failure {
            echo 'Playwright tests failed!'
        }
    }
}