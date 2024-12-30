class LotteryGame {
  constructor() {
    this.isRunning = false;
    this.currentIndex = 0;
    this.sequence = [0, 1, 2, 3, 4, 5, 6, 7];
    this.items = document.querySelectorAll(".grid-item");
    this.startBtn = document.querySelector(".start-btn");
    this.isStoppingRequested = false;
    this.initialSpeed = 50;
    this.currentSpeed = this.initialSpeed;
    this.stopStartTime = 0;
    this.stoppingDuration = 3000;
    this.finalStopIndex = null;

    this.startBtn.addEventListener("click", () => this.toggleGame());
  }

  toggleGame() {
    if (this.startBtn.classList.contains("disabled")) {
      return;
    }

    if (!this.isRunning) {
      this.start();
    } else {
      this.stop();
    }
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isStoppingRequested = false;
    this.currentSpeed = this.initialSpeed;
    this.finalStopIndex = null;
    this.startBtn.textContent = "停止";
    this.startBtn.classList.add("stopping");
    this.run();
  }

  stop() {
    if (!this.isRunning || this.isStoppingRequested) return;

    this.isStoppingRequested = true;
    this.stopStartTime = Date.now();
    this.startBtn.classList.add("disabled");

    const remainingRounds = 1;
    const currentPosition = this.currentIndex;
    const totalSteps =
      remainingRounds * this.sequence.length +
      2 +
      Math.floor(Math.random() * 3);
    this.finalStopIndex = (currentPosition + totalSteps) % this.sequence.length;
  }

  run() {
    // 清除所有激活状态
    this.items.forEach((item) => item.classList.remove("active"));

    // 根据sequence获取当前应该高亮的元素
    const currentDataIndex = this.sequence[this.currentIndex];
    const currentElement = document.querySelector(
      `[data-index="${currentDataIndex}"]`
    );
    currentElement.classList.add("active");

    // 如果请求停止，则计算减速
    if (this.isStoppingRequested) {
      const elapsedTime = Date.now() - this.stopStartTime;
      const progress = Math.min(elapsedTime / this.stoppingDuration, 1);

      // 使用easeOut函数使减速更自然
      const easeOut = (1 - progress) * (1 - progress);
      this.currentSpeed =
        this.initialSpeed + (800 - this.initialSpeed) * (1 - easeOut);

      // 检查是否到达最终位置
      if (
        (progress >= 1 || this.currentSpeed >= 800) &&
        this.currentIndex === this.finalStopIndex
      ) {
        this.isRunning = false;
        this.startBtn.textContent = "开始";
        this.startBtn.classList.remove("stopping");
        this.startBtn.classList.remove("disabled");

        setTimeout(() => {
          alert(
            `恭喜您获得奖品 ${
              document.querySelector(
                `[data-index="${this.sequence[this.finalStopIndex]}"]`
              ).innerText
            }！`
          );
        }, 300);
        return;
      }
    }

    // 更新索引
    this.currentIndex = (this.currentIndex + 1) % this.sequence.length;

    // 继续运行
    setTimeout(() => this.run(), this.currentSpeed);
  }
}

// 初始化游戏
const game = new LotteryGame();
