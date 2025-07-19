       // 全局变量
        let scene, camera, renderer, sphere, numbers = [];
        let startNumber = 1;
        let endNumber = 100;
        let drawCount = 5;
        let history = [];
        
        // 初始化Three.js场景
        function initThreeJS() {
            // 创建场景
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a2a);
            scene.fog = new THREE.Fog(0x0a0a2a, 10, 30);
            
            // 创建相机
            camera = new THREE.PerspectiveCamera(75, 
                document.querySelector('.lottery-display').offsetWidth / 
                document.querySelector('.lottery-display').offsetHeight, 
                0.1, 1000
            );
            camera.position.z = 15;
            
            // 创建渲染器
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(
                document.querySelector('.lottery-display').offsetWidth,
                document.querySelector('.lottery-display').offsetHeight
            );
            document.getElementById('three-container').appendChild(renderer.domElement);
            
            // 添加光源
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0xff00cc, 1, 100);
            pointLight.position.set(-5, -5, 5);
            scene.add(pointLight);
            
            // 创建球体
            const geometry = new THREE.SphereGeometry(5, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: 0x1a1a5a,
                emissive: 0x070730,
                specular: 0x00ffff,
                shininess: 100,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            
            sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            
            // 添加旋转动画
            animate();
            
            // 响应窗口大小变化
            window.addEventListener('resize', onWindowResize);
        }
        
        // 窗口大小调整处理
        function onWindowResize() {
            camera.aspect = document.querySelector('.lottery-display').offsetWidth / 
                            document.querySelector('.lottery-display').offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(
                document.querySelector('.lottery-display').offsetWidth,
                document.querySelector('.lottery-display').offsetHeight
            );
        }
        
        // 动画循环
        function animate() {
            requestAnimationFrame(animate);
            
            // 旋转球体
            sphere.rotation.x += 0.005;
            sphere.rotation.y += 0.008;
            
            renderer.render(scene, camera);
        }
        
        // 生成随机数
        function generateRandomNumbers() {
            const results = [];
            const range = endNumber - startNumber + 1;
            
            for (let i = 0; i < drawCount; i++) {
                const randomNum = Math.floor(Math.random() * range) + startNumber;
                results.push(randomNum);
            }
            
            return results;
        }
        
        // 显示结果
        function displayResults(results) {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '';
            
            results.forEach(num => {
                const numDiv = document.createElement('div');
                numDiv.className = 'result-number';
                numDiv.textContent = num;
                resultDiv.appendChild(numDiv);
            });
            
            // 添加到历史记录
            addToHistory(results);
        }
        
        // 添加到历史记录
        function addToHistory(results) {
            history.push({
                time: new Date().toLocaleTimeString(),
                numbers: [...results]
            });
            
            updateHistoryDisplay();
        }
        
        // 更新历史记录显示
        function updateHistoryDisplay() {
            const historyList = document.getElementById('history-list');
            historyList.innerHTML = '';
            
            // 只显示最近的5条记录
            const recentHistory = history.slice(Math.max(history.length - 5, 0));
            
            recentHistory.forEach(record => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const numbersStr = record.numbers.join(', ');
                historyItem.textContent = `${record.time}: ${numbersStr}`;
                
                historyList.appendChild(historyItem);
            });
            
            // 滚动到底部
            historyList.scrollTop = historyList.scrollHeight;
        }
        
        // 开始抽奖动画
        function startDrawAnimation() {
            const sphere = scene.getObjectByName('lotterySphere');
            
            // 创建粒子爆炸效果
            createParticleEffect();
            
            // 稍后显示结果
            setTimeout(() => {
                const results = generateRandomNumbers();
                displayResults(results);
            }, 2000);
        }
        
        // 创建粒子爆炸效果
        function createParticleEffect() {
            const particleCount = 200;
            const particles = new THREE.Group();
            
            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * 0.2 + 0.05;
                const geometry = new THREE.SphereGeometry(size, 16, 16);
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(Math.random() * 0xffffff)
                });
                
                const particle = new THREE.Mesh(geometry, material);
                
                // 设置初始位置
                particle.position.set(0, 0, 0);
                
                // 设置随机速度和方向
                particle.userData.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.2,
                    (Math.random() - 0.5) * 0.2,
                    (Math.random() - 0.5) * 0.2
                );
                
                particles.add(particle);
            }
            
            particles.name = 'particles';
            scene.add(particles);
            
            // 动画粒子
            function animateParticles() {
                particles.children.forEach(particle => {
                    particle.position.add(particle.userData.velocity);
                    particle.material.opacity -= 0.01;
                    
                    if (particle.material.opacity <= 0) {
                        scene.remove(particles);
                        return;
                    }
                });
                
                if (particles.parent) {
                    requestAnimationFrame(animateParticles);
                }
            }
            
            animateParticles();
        }
        
        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            // 初始化Three.js
            initThreeJS();
            
            // 获取输入元素
            const startNumberInput = document.getElementById('start-number');
            const endNumberInput = document.getElementById('end-number');
            const drawCountInput = document.getElementById('draw-count');
            const startBtn = document.getElementById('start-btn');
            const resetBtn = document.getElementById('reset-btn');
            
            // 设置初始值
            startNumber = parseInt(startNumberInput.value);
            endNumber = parseInt(endNumberInput.value);
            drawCount = parseInt(drawCountInput.value);
            
            // 开始抽奖按钮事件
            startBtn.addEventListener('click', () => {
                // 获取当前值
                startNumber = parseInt(startNumberInput.value);
                endNumber = parseInt(endNumberInput.value);
                drawCount = parseInt(drawCountInput.value);
                
                // 验证输入
                if (isNaN(startNumber) || isNaN(endNumber) || isNaN(drawCount)) {
                    alert('请输入有效的数字');
                    return;
                }
                
                if (startNumber >= endNumber) {
                    alert('结束号数必须大于起始号数');
                    return;
                }
                
                if (drawCount < 1) {
                    alert('每次抽取数量至少为1');
                    return;
                }
                
                // 开始抽奖动画
                startDrawAnimation();
            });
            
            // 重置按钮事件
            resetBtn.addEventListener('click', () => {
                history = [];
                document.getElementById('result').innerHTML = '';
                updateHistoryDisplay();
                
                // 重置输入
                startNumberInput.value = "1";
                endNumberInput.value = "100";
                drawCountInput.value = "5";
                
                startNumber = 1;
                endNumber = 100;
                drawCount = 5;
            });
        });