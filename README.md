# web3-projects

# 本地开发部署合约流程

1. remix
   编写合约
   部署到 Custom - External Http Provider
   网络端口与 ganache 一致
2. ganache
   提供网络节点服务
   提供测试账户
   同时 id，最好和 metamask 一致
3. metamask
   先登录，账户 token 会在不同网络共享
   切换网到本地端口与上面一致
   同时 id
