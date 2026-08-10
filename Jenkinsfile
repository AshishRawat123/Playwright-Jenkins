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

        stage('Run Tests') {
             steps {
                withCredentials([
                    file(
                        credentialsId: 'playwright-test-config',
                        variable: 'TEST_CONFIG'
                    )
                ]) {
                    bat 'npx playwright test'
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