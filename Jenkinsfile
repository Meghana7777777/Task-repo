pipeline {
    agent any
    environment {
        CI_PROJECT_DIR = "${WORKSPACE}"
        PATH = "${WORKSPACE}/node_modules/.bin:$PATH"
    }
    stages {
        stage('Replace config-files ') {
            steps {
                sh '''
                    cp -f documents/live/live_config.ts libs/shared-services/src/lib/config.ts
                    cp -f documents/live/live-hrms-master.config-default services/masters/src/config/config-default.ts
                    cp -f documents/live/live-hrms-leave-management.config-default services/leave-management/src/config/config-default.ts
                    cp -f documents/live/live-hrms-employee-management.config-default services/employee-management/src/config/config-default.ts
                    cp -f documents/live/live-hrms-payroll-management.config-default services/payroll-management/src/config/config-default.ts
                    cp -f documents/live/live-hrms-ums.config-default services/ums/src/config/config-default.ts
                    cp -f documents/live/vite.config.ts ui/vite.config.ts
                '''
            }
        }
        stage('Check Node Version') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install --force'
            }
        }
        stage('Check Nx Version') {
            steps {
                sh 'nx --version'
                sh 'nx reset'
            }
        }
        stage('Build Backend') {
            steps {
                script {
                    sh '''
                        export PATH="$CI_PROJECT_DIR/node_modules/.bin:$PATH"
                        nx run employee-management:build --skip-nx-cache
                        nx run leave-management:build --skip-nx-cache
                        nx run masters:build --skip-nx-cache
                    '''
                }
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    sh '''
                        export PATH="$CI_PROJECT_DIR/node_modules/.bin:$PATH"
                        nx run ui:build --skip-nx-cache
                    '''
                }
            }
        }
        /*
        stage('Modify index.html') {
            steps {
                script {
                    sh '''
                        sed -i 's|<base href="/">|<base href="/hrms-v2_app/">|g' $CI_PROJECT_DIR/dist/ui/index.html
                    '''
                }
            }
        }
        stage('Transfer Build Files') {
            steps {
                sshagent(credentials: ['2']) { // Use the correct credentials ID
                    sh '''
                        ssh root@64.227.139.50 "rm -rf /var/www/html/hrms-v2_app/*"
                        ssh root@64.227.139.50 "rm -rf /var/www/html/hrms-v2/dist/services"
                        scp -r $CI_PROJECT_DIR/dist/ui/* root@64.227.139.50:/var/www/html/hrms-v2_app
                        scp -r $CI_PROJECT_DIR/dist/services root@64.227.139.50:/var/www/html/hrms-v2/dist
                    '''
                }
            }
        }
        stage('Restart Services with PM2') {
            steps {
                sshagent(credentials: ['2']) { // Use the correct credentials ID
                    sh '''
                        ssh root@64.227.139.50 <<EOF
pm2 restart hrms-v2-masters_4000 hrms-v2-emp_4001 hrms-v2-leave_4002
pm2 save
EOF
                    '''
                }
            }
        }
    }
    post {
        success {
            script {
                def startTime = currentBuild.getStartTimeInMillis()
                def endTime = System.currentTimeMillis()
                def duration = (endTime - startTime) / 1000

                emailext(
                    to: 'saikumarvardhi7799@gmail.com, rajud@schemaxtech.com, arunkumars@schemaxtech.com',
                    subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' was successful.
Start Time: ${new Date(startTime)}
End Time: ${new Date(endTime)}
Duration: ${duration} seconds
Check console output at ${env.BUILD_URL} to view the results."""
                )
            }
        }
        failure {
            script {
                def logFile = "${WORKSPACE}/log"
                def logContent = ""
                if (fileExists(logFile)) {
                    logContent = readFile(logFile).take(1000)
                } else {
                    logContent = "Log file not found."
                }

                emailext(
                    to: 'saikumarvardhi7799@gmail.com, rajud@schemaxtech.com, arunkumars@schemaxtech.com',
                    subject: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' failed.
Error Log:
${logContent}
Check console output at ${env.BUILD_URL} to view the results."""
                )
            }
        }
        */
    }
}
