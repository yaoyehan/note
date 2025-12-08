# 一、sql调优
1. 打开慢sql日志
```sql
set global slow_query_log='ON';
```
2. 设置慢sql的时间标准:比如这里是超过5秒
```sql
set global long_query_time=5;
```
3. 查看慢sql日志的存储位置
```sql
show global variables like 'slow_query_log_file';
```
4. 对日志文件进行统计分析并倒叙查询
```sql
mysqldumpslow /var/lib/mysql/8e9a647f3044-slow.log
```
创建索引：
* explain解析sql，查询执行情况
* 使用最具有区分度的字段创建索引
* 大数据集避免内存排序，使用排序字段索引优化
* 复杂sql需要符合最左匹配
* 覆盖索引，避免回表
* 避免隐式类型转换导致的索引失效
* 避免使用!=、not in、not null、not exist（会导致索引失效，因为优化器认为通过二级索引过滤不需要的数据的效果非常有限，过滤完还要扫表，不如直接扫表）
* 避免运算导致的索引失效（当字段值变化就无法拿原来的索引树来过滤）
* 模糊匹配，%在左边会导致索引失效（数据量小时可以使用数据库自带的全文索引，数据量大时可以使用es）