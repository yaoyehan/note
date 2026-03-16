## 1. 基本概念
线性模型公式: 
$\text{ў} = x \cdot \omega$
```ad-question
如何使得模型无限逼近最小损失呢？
```
* 使用梯度下降查找函数的损失的最小值就可以了！
如下：
$cost(\omega) = \dfrac{1}{N} \sum_{n=1}^{N} (\hat{y}_n - y_n)^2$
这个公式是平方差损失函数(**MSE**)，再通过这个损失函数可以得出，$\omega$的更新$\omega = \omega - \alpha \dfrac{\partial cost}{\partial \omega}$
当斜率为正的时候，$\omega$减少，当斜率为负的时候，$\omega$增加。这样$cost(\omega)$就可以逼近最优点。
![[平方差损失函数.png|600]]

```ad-question
那搭建模型通过多个线性模型叠加可以吗？
```
显然不行，如下，多个线性模型叠加还是线性模型，即$\hat{y} = W_2(W_1 \cdot X + b_1) + b_2$计算后的结果还是$\hat{y} = W_1 \cdot X + b_1$本质没有变化，因此需要引入==激活函数==！
![[线性函数叠加.png|600]]


```ad-question
那模型是怎么训练的呢？
```
模型训练涉及到一个概念叫做反向传播，什么是==正向/反向传播==呢？
==正向传播==：简单来说就是输入数据从**输入层流向输出层**的过程。
==反向传播==：从正向传播得到的**损失值**，从**神经网络的输出层反向传递到输入层**，计算每一层参数（权重，偏置）的梯度，用来更新参数以最小化损失。
如下：
![[正向传播和反向传播.png]]

使用pytorch实现线性模型

```python
import torch  
  
from common.functions import y_pre, model, criterion, optimizer  
  
x_data = torch.tensor([[1.0], [2.0], [3.0]])  
y_data = torch.tensor([[2.0], [4.0], [6.0]])  
  
class LinearModel(torch.nn.Module):  
    def __init__(self):  
        super(LinearModel, self).__init__()  
        # (1,1)是指输入x和输出y的特征维度，这里数据集中的x和y的特征都是1维的  
        # 该线性层需要学习的参数是w和b  获取w/b的方式分别是~linear.weight/linear.bias  
        self.linear = torch.nn.Linear(1,1)  
  
    def forward(self,x):  
        y_pred = self.linear(x)  
        return y_pred  
  
model = LinearModel()  
# 均方误差损失，'sum': 对所有样本的损失求和，'mean'（默认）：对所有样本的损失求平均  
criterion = torch.nn.MSELoss(reduction='sum')  
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)  
  
for epoch in range(500):  
    y_pred = model(x_data)  
    loss = criterion(y_pred, y_data)  
    print(epoch, loss.item())  
  
    optimizer.zero_grad()  
    loss.backward() # backward: autograd，自动计算梯度  
    optimizer.step()  # update 参数，即更新w和b的值  
  
# item() 用于提取单个数值，.data 用于访问 Tensor 数据（可包含多个值）
print('w = ', model.linear.weight.item())  
print('b = ', model.linear.bias.item())  
  
x_test = torch.tensor([[4.0]])  
y_test = model(x_test)  
print('y_pred = ', y_test.data)
```

```ad-question
那如果涉及到判断样本属于哪一类别的问题，明显不能使用线性回归，应该怎么处理呢？
```

	此时就需要引入一个概念：逻辑斯蒂回归（Logistic Regression）

逻辑斯蒂回归（**Logistic Regression**）是一种二分类任务的统计模型，通过**Sigmoid函数**（激活函数）可以把结果映射到[0,1]之间，从而预测类别。

公式：$\sigma(x) = \dfrac{1}{1 + e^{-x}}$
当x->$+\infty$，y->1,当x->$-\infty$,y->0,所以y在[0,1]之间。

![[Pasted image 20260315163908.png|600]]
此时我们也不能用原来的平均差损失函数了，因为**Sigmoid函数**的非线性，平均差损失函数会出现多个局部最小值，平均差损失很容易陷入局部最优解而无法找到全局最优。因此得用二分类的交叉熵损失函数。

公式：$loss = -(y \log \hat{y} + (1 - y) \log(1 - \hat{y}))$
当y=1时，$loss = - \log \hat{y}$，当y越大，loss越小，当y=0时，$loss = -log(1 - \hat{y})$，当y越小，loss越小。
对所有可能的二分类求和公式为：$loss = -\dfrac{1}{N} \sum_{n=1}^{N} y_n \log \hat{y}_n + (1 - y_n) \log(1 - \hat{y}_n)$
torch的写法为：BCE(**binary cross-entropy**)二分类交叉熵
```python
criterion = torch.nn.BCELOSS (size_average=False)
```

代码示例：
```python
import torch  
  
x_data = torch.tensor([[1.0], [2.0], [3.0]])  
y_data = torch.tensor([[0.0], [0.0], [1.0]])  
  
# 继承父类Module  
class LogisticRegressionModel(torch.nn.Module):  
    def __init__(self):  
        super(LogisticRegressionModel, self).__init__()  
        self.linear = torch.nn.Linear(1, 1)  
  
    def forward(self, x):  
        y_pred = torch.sigmoid(self.linear(x))  
        return y_pred  
  
model = LogisticRegressionModel()  

# 因为是二分类交叉熵，所以是BCELoss，mean：对 batch 中所有样本的损失求平均值作为最终损失
criterion = torch.nn.BCELoss(reduction='mean')  
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)  
  
for epoch in range(1000):  
    y_pred = model(x_data)  
    loss = criterion(y_pred, y_data)  
    print(epoch, loss.item())  
  
    optimizer.zero_grad()  
    loss.backward()  
    optimizer.step()  
  
print('w = ', model.linear.weight.item())  
print('b = ', model.linear.bias.item())
```