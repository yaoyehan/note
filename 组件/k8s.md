## 什么是k8s？
K8s是kubernetes的简称，其本质是一个开源的容器编排系统，主要用于管理容器化的应用。
## k8s的组件有哪些，作用分别是什么？
k8s主要由**master**节点和**node**节点构成。
**master**节点负责管理集群，**node**节点是容器应用真正运行的地方。
master节点包含的组件有：kube-api-server、kube-controller-manager、kube-scheduler、etcd。
node节点包含的组件有：kubelet、kube-proxy、container-runtime。

1. **kube-api-server**
>它是k8s集群管理的统一访问入口,提供了RESTful API接口, 实现了认证、授权和准入控制等安全功能,并且只有api-server才能直接操作etcd数据库，其他组件都不能直接操作etcd数据库，其他组件都是通过api-server间接的读取，写入数据到etcd。

2. **kube-controller-manager：**
>controller-manager是k8s中各种控制器的的管理者，是k8s集群内部的管理控制中心，也是k8s自动化功能的核心；controller-manager内部包含replication controller、node controller、deployment controller、endpoint controller等各种资源对象的控制器，每种控制器都负责一种特定资源的控制流程，而controller-manager正是这些controller的核心管理者。

3. **kube-scheduler：**
>以下简称scheduler，scheduler负责集群资源调度，其作用是将待调度的pod通过一系列复杂的调度算法计算出最合适的node节点，然后将pod绑定到目标节点上。

4. **Etcd：**
>etcd是一个分布式的键值对存储数据库，主要是用于保存k8s集群状态数据，比如，pod，service等资源对象的信息；

5. **kubelet：**
>每个node节点上都有一个kubelet服务进程，kubelet作为连接master和各node之间的桥梁，负责维护pod和容器的生命周期，当监听到master下发到本节点的任务时，比如创建、更新、终止pod等任务，kubelet 即通过控制docker来创建、更新、销毁容器；  每个kubelet进程都会在api-server上注册本节点自身的信息，用于定期向master汇报本节点资源的使用情况。

6. **kube-proxy：**
> 其核心功能是将到某个Service的访问请求转发到后端的多个Pod实例上。

7. **container-runtime**
> 容器运行时环境，即运行容器所需要的一系列程序，目前k8s支持的容器运行时有很多，如docker、rkt或其他，比较受欢迎的是docker，但是新版的k8s已经宣布弃用docker