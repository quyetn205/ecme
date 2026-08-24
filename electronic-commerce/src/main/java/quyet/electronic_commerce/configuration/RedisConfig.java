package quyet.electronic_commerce.configuration;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Cấu hình mặc định: dùng JDK Serializer (ổn định nhất), TTL = 30 phút
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .disableCachingNullValues();

        // Cấu hình TTL riêng cho từng cache
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();

        // Categories: ít thay đổi → cache lâu (60 phút)
        cacheConfigs.put("categories", defaultConfig.entryTtl(Duration.ofMinutes(60)));
        cacheConfigs.put("category", defaultConfig.entryTtl(Duration.ofMinutes(60)));

        // Product detail: cache 30 phút (dùng default)
        cacheConfigs.put("product", defaultConfig.entryTtl(Duration.ofMinutes(30)));

        // Dashboard summary: dữ liệu thống kê → cache 5 phút
        cacheConfigs.put("dashboard-summary", defaultConfig.entryTtl(Duration.ofMinutes(5)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }
}
