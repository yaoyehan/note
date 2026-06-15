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

![[Sigmoid激活函数.png|600]]
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

```ad-question
那如果是多分类问题，应该怎么处理？
```
由于二分类loss求和公式为：$loss = -\dfrac{1}{N} \sum_{n=1}^{N} y_n \log \hat{y}_n + (1 - y_n) \log(1 - \hat{y}_n)$，注意观察这个公式，这个公式出现是因为在二分类的情况下，y只有1和0两种情况，所以在计算loss的时候需要考虑这两种情况，其实也可以看成一种情况，当y=0的时候，1-y可以理解为把结果当成y=1的情况来看，此时$\hat{y}$也得改为$(1 - \hat{y}_n)$，但是对于多分类问题，肯定有个分类的结果为1，所以多分类的损失函数为：$loss = -\dfrac{1}{N} \sum_{n=1}^{N} y_n \log \hat{y}_n$。

![[交叉熵损失函数.png]]

> 注意torch.nn.CrossEntropyLoss()这个交叉熵损失函数已经包含了softmax（**激活函数**）部分，所以在构建模型的时候记得最后一步不要加上激活函数。

``` python
import torch
from torchvision import transforms
from torchvision import datasets
from torch.utils.data import DataLoader
import torch.nn.functional as F
import torch.optim as optim
 
# prepare dataset
 
batch_size = 64
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]) # 归一化,均值和方差
 
train_dataset = datasets.MNIST(root='../dataset/mnist/', train=True, download=True, transform=transform)
train_loader = DataLoader(train_dataset, shuffle=True, batch_size=batch_size)
test_dataset = datasets.MNIST(root='../dataset/mnist/', train=False, download=True, transform=transform)
test_loader = DataLoader(test_dataset, shuffle=False, batch_size=batch_size)
 
# design model using class
 
 
class Net(torch.nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 图片的纬度是（N，1,28,28）转为（N，784）
        self.l1 = torch.nn.Linear(784, 512)
        self.l2 = torch.nn.Linear(512, 256)
        self.l3 = torch.nn.Linear(256, 128)
        self.l4 = torch.nn.Linear(128, 64)
        self.l5 = torch.nn.Linear(64, 10)
 
    def forward(self, x):
        x = x.view(-1, 784)  # -1其实就是自动获取mini_batch
        x = F.relu(self.l1(x))
        x = F.relu(self.l2(x))
        x = F.relu(self.l3(x))
        x = F.relu(self.l4(x))
        return self.l5(x)  # 最后一层不做激活，不进行非线性变换
 
 
model = Net()
 
# construct loss and optimizer
criterion = torch.nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.5)
 
# training cycle forward, backward, update
 
 
def train(epoch):
    running_loss = 0.0
    for batch_idx, data in enumerate(train_loader, 0):
        # 获得一个批次的数据和标签
        inputs, target = data
        optimizer.zero_grad()
        # 获得模型预测结果(64, 10)
        outputs = model(inputs)
        # 交叉熵代价函数outputs(64,10),target（64）
        loss = criterion(outputs, target)
        loss.backward()
        optimizer.step()
 
        running_loss += loss.item()
        if batch_idx % 300 == 299:
            print('[%d, %5d] loss: %.3f' % (epoch+1, batch_idx+1, running_loss/300))
            running_loss = 0.0
 
 
def test():
    correct = 0
    total = 0
    with torch.no_grad():
        for data in test_loader:
            images, labels = data
            outputs = model(images)
            _, predicted = torch.max(outputs.data, dim=1) # dim = 1 列是第0个维度，行是第1个维度
            total += labels.size(0)
            correct += (predicted == labels).sum().item() # 张量之间的比较运算
    print('accuracy on test set: %d %% ' % (100*correct/total))
 
 
if __name__ == '__main__':
    for epoch in range(10):
        train(epoch)
        test()
```

```ad-question
卷积有什么用？
```
>使用全连接的前提是将输入转为张量，但是这样会导致丢失数据的空间信息，如（1,2）未知的元素和（2,2）位置的元素从空间看是相邻的，但是转为张量后这种关系就消失了，**卷积的目的就是将这种空间信息保留**。

![[卷积示意图.png]]
> 注意: **channel=3**的数据被**channel=3**的卷积核卷积后，**channel=1**，也即是，**卷积可以改变channel数量**，想要多少channel，那就准备多少个卷积核。所以经常会有1 * 1的卷积核，目的就是为了融合相同位置不同channel的信息，减少channel数量。


```ad-question
卷积一定会导致宽度和高度降低吗？
```
不一定，可以使用**pending**补齐周围的元素！
![[pending.png]]

```ad-question
什么是池化，池化有什么用？
```
如最大池化，和卷积类似，区别是卷积需要卷积核，池化不需要，如最大池化，指定范围内的所有数找最大值。因为池化的步长=池化的w/h,所以池化可以倍率级的减少w/h，当然池化可以通过pending和stride保证大小是一样的。
![[最大池化.png]]

```python
import torch
from torchvision import transforms
from torchvision import datasets
from torch.utils.data import DataLoader
import torch.nn.functional as F
import torch.optim as optim
import matplotlib.pyplot as plt
 
# prepare dataset
 
batch_size = 64
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))])
 
train_dataset = datasets.MNIST(root='../dataset/mnist/', train=True, download=True, transform=transform)
train_loader = DataLoader(train_dataset, shuffle=True, batch_size=batch_size)
test_dataset = datasets.MNIST(root='../dataset/mnist/', train=False, download=True, transform=transform)
test_loader = DataLoader(test_dataset, shuffle=False, batch_size=batch_size)
 
# design model using class
 
 
class Net(torch.nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = torch.nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = torch.nn.Conv2d(10, 20, kernel_size=5)
        self.pooling = torch.nn.MaxPool2d(2)
        self.fc = torch.nn.Linear(320, 10)
 
 
    def forward(self, x):
        # flatten data from (n,1,28,28) to (n, 784)
        
        batch_size = x.size(0)
        x = F.relu(self.pooling(self.conv1(x)))
        x = F.relu(self.pooling(self.conv2(x)))
        x = x.view(batch_size, -1) # -1 此处自动算出的是320
        # print("x.shape",x.shape)
        x = self.fc(x)
 
        return x
 
 
model = Net()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
 
# construct loss and optimizer
criterion = torch.nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.5)
 
# training cycle forward, backward, update
 
 
def train(epoch):
    running_loss = 0.0
    for batch_idx, data in enumerate(train_loader, 0):
        inputs, target = data
        inputs, target = inputs.to(device), target.to(device)
        optimizer.zero_grad()
 
        outputs = model(inputs)
        loss = criterion(outputs, target)
        loss.backward()
        optimizer.step()
 
        running_loss += loss.item()
        if batch_idx % 300 == 299:
            print('[%d, %5d] loss: %.3f' % (epoch+1, batch_idx+1, running_loss/300))
            running_loss = 0.0
 
 
def test():
    correct = 0
    total = 0
    with torch.no_grad():
        for data in test_loader:
            images, labels = data
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs.data, dim=1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    print('accuracy on test set: %d %% ' % (100*correct/total))
    return correct/total
 
 
if __name__ == '__main__':
    epoch_list = []
    acc_list = []
    
    for epoch in range(10):
        train(epoch)
        acc = test()
        epoch_list.append(epoch)
        acc_list.append(acc)
    
    plt.plot(epoch_list,acc_list)
    plt.ylabel('accuracy')
    plt.xlabel('epoch')
    plt.show()
```

```ad-question
网络是不是越深越好？
```
网络深不仅带来过拟合的问题，还会导致**梯度消失**。（个人理解：参数越多，相当于构成这个模型的图越细腻，两点之间的斜率越小，越可能出现梯度消失的问题）
解决方法：**残差网络**（Residual Network）
![[Residual Network.png|600]]
> 可以看到，最终的输出+x（输入）构成新的输出，这个也叫**跳连接**，要知道h对x求导=h对f求导*f对x求导，但是层数如果继续增大呢？假设有5层网络，第5层网络的结果对x求偏导=第5层网络对第4层网络求偏导*对第4层网络对x求偏导+第四层网络的输出（可以看成图中的x），第4层网络求偏导以此类推，每一层如果能+上一层的输出，那么相当于每一个偏导结果都+1,这样梯度就不会消失了。

注意：跳连接的时候，**维度必须一样**，**加完后再激活**（避免丢失原始特征的负向信息）。

![[Pasted image 20260322172951.png]]

```python
import torch
import torch.nn as nn
from torchvision import transforms
from torchvision import datasets
from torch.utils.data import DataLoader
import torch.nn.functional as F
import torch.optim as optim
 
# prepare dataset
 
batch_size = 64
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]) # 归一化,均值和方差
 
train_dataset = datasets.MNIST(root='../dataset/mnist/', train=True, download=True, transform=transform)
train_loader = DataLoader(train_dataset, shuffle=True, batch_size=batch_size)
test_dataset = datasets.MNIST(root='../dataset/mnist/', train=False, download=True, transform=transform)
test_loader = DataLoader(test_dataset, shuffle=False, batch_size=batch_size)
 
# design model using class
class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super(ResidualBlock, self).__init__()
        self.channels = channels
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
 
    def forward(self, x):
        y = F.relu(self.conv1(x))
        y = self.conv2(y)
        return F.relu(x + y)
 
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 16, kernel_size=5)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=5) # 88 = 24x3 + 16
 
        self.rblock1 = ResidualBlock(16)
        self.rblock2 = ResidualBlock(32)
 
        self.mp = nn.MaxPool2d(2)
        self.fc = nn.Linear(512, 10) # 暂时不知道1408咋能自动出来的
 
 
    def forward(self, x):
        in_size = x.size(0)
 
        x = self.mp(F.relu(self.conv1(x)))
        x = self.rblock1(x)
        x = self.mp(F.relu(self.conv2(x)))
        x = self.rblock2(x)
 
        x = x.view(in_size, -1)
        x = self.fc(x)
        return x
 
model = Net()
 
# construct loss and optimizer
criterion = torch.nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.5)
 
# training cycle forward, backward, update
 
 
def train(epoch):
    running_loss = 0.0
    for batch_idx, data in enumerate(train_loader, 0):
        inputs, target = data
        optimizer.zero_grad()
 
        outputs = model(inputs)
        loss = criterion(outputs, target)
        loss.backward()
        optimizer.step()
 
        running_loss += loss.item()
        if batch_idx % 300 == 299:
            print('[%d, %5d] loss: %.3f' % (epoch+1, batch_idx+1, running_loss/300))
            running_loss = 0.0
 
 
def test():
    correct = 0
    total = 0
    with torch.no_grad():
        for data in test_loader:
            images, labels = data
            outputs = model(images)
            _, predicted = torch.max(outputs.data, dim=1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    print('accuracy on test set: %d %% ' % (100*correct/total))
 
 
if __name__ == '__main__':
    for epoch in range(10):
        train(epoch)
        test()
```

```ad-question
对于有序列关系的问题，应该怎么处理，如给定气压、温度，推测今天是否下雨
```
单纯从上面的知识，将4天的（气压、温度）数据合为一个集合，基于前3天的数据+第四天的气压，温度来推第四天是否下雨其实也是可行的，但是需要注意，第二天的气压、温度是会依赖第一天的数据，前后数据有序列关系，这种问题应该怎么处理？

此时就需要用到**RNN（循环神经网络）**。

![[RNN示意图.png]]
