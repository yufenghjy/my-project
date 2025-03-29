from faker import Faker
import pandas as pd
import random

fake = Faker("zh_CN")

# 省份-城市映射表（示例）
PROVINCE_CITIES = {
    "北京市": ["北京市"],
    "上海市": ["上海市"],
    "浙江省": ["杭州市", "宁波市", "温州市"],
    "广东省": ["广州市", "深圳市", "东莞市"]
}

# 生成单条数据
def generate_record(record_id):
    province = random.choice(list(PROVINCE_CITIES.keys()))
    city = random.choice(PROVINCE_CITIES[province])
    
    return {
        "id": record_id,
        "date": fake.date_between("-3y").strftime("%Y-%m-%d"),
        "name": fake.name(),
        "province": province,
        "city": city,
        "address": f"{province}{city}{fake.street_name()}{fake.building_number()}号",
        "zip": fake.postcode()[0:6]  # 取邮编前6位
    }

# 生成1000条数据
data = [generate_record(i) for i in range(1, 1001)]

# 导出CSV
pd.DataFrame(data).to_csv("mock_data.csv", index=False)