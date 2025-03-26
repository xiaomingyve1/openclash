# openclash 适用于流媒体增强

下载 openclash.yaml 文件，直接上传到openclash-配置管理-编辑，填写订阅即可。  
自用于openclash的流媒体增强，此版本仅更改策略组和规则集，需要自行调整插件设置/覆写设置。  
规则策略比较多，并不适合256mb设备，慎用！  

# 对于 UrlTest 失效的问题，可以通过计划任务crontab定时热加载配置（不重启不断网）刷新测速
# openclash自动重载配置  
#（127.0.0.1:9090+admin）IP地址+端口+密钥 更改为自己的  
00 */1 * * * curl -X POST "http://127.0.0.1:9090/configs" -H "Authorization: Bearer admin" -H "Content-Type: application/json" -d '{"path":"/etc/openclash/config.yaml"}'; sleep 5; curl -X PUT "http://127.0.0.1:9090/configs?force=true" -H "Authorization: Bearer admin" -H "Content-Type: application/json" -d '{"path":"","payload":""}'
  
# 图例
![策略组1](https://github.com/user-attachments/assets/27702213-5515-4d67-9ef1-cee3af70880a)
![策略组2](https://github.com/user-attachments/assets/62c92c61-e429-48ce-88e1-6cdd54268312)
![解锁](https://github.com/user-attachments/assets/beff0927-54be-487a-aaa8-d8f50ee99fe3)
