### 1. 删除Maven的build插件
```xml
  <build>
      <plugins>
          <plugin>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-maven-plugin</artifactId>
          </plugin>
      </plugins>
  </build>

```
>为什么要删掉这个插件呢？

**如果 SDK 使用了 spring-boot-maven-plugin，会导致 jar 包结构变化：**
  *错误的 jar 结构（使用了 spring-boot-maven-plugin）：*
  my-redis-starter.jar
  ├── BOOT-INF/
  │   ├── classes/          ← 类在这里，Maven 找不到！
  │   │   └── com/anker/redis/...
  │   └── lib/
  └── META-INF/

  *正确的 jar 结构（不用 spring-boot-maven-plugin）：*
  my-redis-starter.jar
  ├── com/anker/redis/      ← 类在根路径，Maven 能找到
  └── META-INF/
### 2. 删除启动类

由于这不是一个Web项目，因此我们需要将启动类给删除
### 3. 编写配置类(在配置类中把所有需要注入的依赖进行注入)
eg:
```  java
// 配置类
  @Configuration
  public class RedisAutoConfiguration {

      @Bean
      @ConditionalOnMissingBean  // 允许使用方覆盖
      public RedisService redisService(RedisTemplate redisTemplate) {
          return new RedisService(redisTemplate);
      }
  }

或者
 @Configuration
  @ComponentScan(basePackages = "com.anker.redis.sdk")
  public class RedisAutoConfiguration {
  }

  // RedisService 加 @Service
  @Service
  public class RedisService {
      // ...
  }

```

### 4. 在org.springframework.boot.autoconfigure.AutoConfiguration.imports文件中配置项目配置类的路径
![[自动注入配置.png]]
eg：
```java
com.common.redis.sdk.configure.RedisConfig
```
```ad-question
为什么要这么配置，不能直接@Autowired
作为 SDK/依赖包（必须用 AutoConfiguration）

  // 你的 SDK 包结构
  com.anker.redis.sdk
    └── service
        └── RedisService.java (@Component)

  // 使用方的项目结构  
  com.example.app
    └── Application.java  (启动类)

  问题：使用方的 Application.java 默认只扫描 com.example.app 包及其子包，不会扫描到 com.anker.redis.sdk 包下的 @Component！

```
### 5. 使用Maven构建成Jar包
![[jar包.png]]
6. 引入依赖
```xml
        <dependency>
             <groupId>com.common.redis.sdk</groupId>
            <artifactId>common-redis-sdk</artifactId>
            <version>0.0.1</version>
        </dependency>
```
