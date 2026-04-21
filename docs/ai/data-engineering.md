# Data Storage Formats & Database Categories

## OLTP vs OLAP

| Aspect | OLTP | OLAP |
|--------|------|------|
| **Purpose** | Process transactions | Analyze data |
| **Operations** | INSERT, UPDATE, DELETE | SELECT, aggregate, join |
| **Query pattern** | Simple, by primary key | Complex, full-table scans |
| **Data scope** | Current state, single rows | Historical, millions of rows |
| **Response time** | Milliseconds | Seconds to minutes |
| **Users** | App users, services | Analysts, dashboards |
| **Schema** | Normalized (3NF) | Denormalized (star/snowflake) |
| **Concurrency** | Thousands of short txns | Few long-running queries |
| **Optimized for** | Write throughput | Read throughput |

## Database Categories

| Category | How it stores | Best for | Examples |
|----------|--------------|----------|----------|
| **Row-oriented** | Records together | OLTP, single-record access | MySQL, PostgreSQL, MongoDB (BSON) |
| **Column-oriented** | Columns together | OLAP, aggregations | Parquet, ORC, ClickHouse, Redshift |
| **Document** | Nested JSON/BSON trees | Flexible schema, hierarchical data | MongoDB, CouchDB, Firestore |
| **Key-Value** | Hash map (key → blob) | Cache, session, config | Redis, DynamoDB, etcd |
| **Graph** | Nodes + edges | Relationships, traversals | Neo4j, Amazon Neptune, JanusGraph |
| **Time-series** | Timestamp-indexed | Metrics, IoT, logs | Prometheus, InfluxDB, TimescaleDB |
| **Wide-column** | Column families | Sparse data, high write throughput | Cassandra, HBase, ScyllaDB |
| **Vector** | Embeddings (float arrays) | AI/ML similarity search | Pinecone, Milvus, pgvector |
| **Hybrid (HTAP)** | Row + column combined | Both OLTP + OLAP | TiDB, SingleStore, AlloyDB |

## File Formats

### Row-Oriented File Formats

- **CSV** — Plain text, delimiter-separated. No types, no compression, no indexes. Universal but inefficient.
- **JSON Lines** — One JSON object per line. Self-describing schema. Good for streaming.
- **Avro** — Binary, schema-embedded, row-oriented. Compact, schema evolution support. Kafka's default.

### Columnar File Formats

#### Parquet

Industry standard columnar format (Apache). Stores data in row groups, each containing column chunks with per-column compression and min/max statistics.

```
File = [Row Group 1] [Row Group 2] ... [Footer (schema + stats)]
Row Group = [Column Chunk A] [Column Chunk B] ...
Column Chunk = [Page 1 (compressed)] [Page 2] ...
```

- **Predicate pushdown**: skip row groups where `min/max` doesn't match filter
- **Projection pushdown**: read only requested columns
- **Nested data**: Dremel encoding (repetition + definition levels)
- **Compression**: Snappy (fast), ZSTD (balanced), Gzip (small)

#### ORC (Optimized Row Columnar)

Hadoop/Hive ecosystem columnar format. Similar to Parquet but with built-in indexes and ACID support.

```
File = [Stripe 1] [Stripe 2] ... [Footer]
Stripe (~250MB) = [Index] [Data (columnar)] [Stripe Footer]
```

- **Built-in bloom filters** and min/max indexes per stripe
- **Native ACID** transactions (Hive)
- **Better for**: Hive workloads, UPDATE/DELETE on data lake

#### Parquet vs ORC

| Aspect | Parquet | ORC |
|--------|---------|-----|
| Ecosystem | Universal | Hive-centric |
| Nested data | Better (Dremel) | Struct/List/Map |
| ACID | No | Yes (Hive) |
| Indexes | Min/max, optional bloom | Built-in bloom + min/max |
| Adoption | Industry standard | Hadoop shops |

### Serialization Formats

- **Protocol Buffers** — Google's binary format. Schema-defined (.proto), compact, fast. gRPC's wire format.
- **Thrift** — Facebook's equivalent to Protobuf. Less common now.
- **MessagePack** — Binary JSON. Smaller than JSON, faster to parse.
- **BSON** — Binary JSON (MongoDB's native format). Supports types JSON doesn't (Date, Binary, ObjectId).
- **Arrow** — In-memory columnar format. Zero-copy reads, cross-language (Python ↔ Java ↔ Rust). Not a file format but a memory layout.

## Storage Engine vs File Format

| Layer | Purpose | Examples |
|-------|---------|----------|
| **File format** | How bytes are laid out on disk | CSV, Parquet, ORC, Avro |
| **Storage engine** | How a database manages reads/writes | InnoDB, WiredTiger, RocksDB |
| **Database** | Query interface + storage engine | MySQL (InnoDB), MongoDB (WiredTiger) |

A database can use multiple file formats (Spark reads CSV, Parquet, ORC, JSON). A file format has no query engine — it's just bytes on disk.

## Data Pipeline Pattern

```
Source (OLTP)  →  ETL/ELT  →  Warehouse (OLAP)  →  BI/Analytics
  MongoDB          Spark        Snowflake            Grafana
  row-oriented     transform    column-oriented      dashboards
  CSV/JSON         validate     Parquet/ORC          SQL queries
```

## When to Use What

| Scenario | Format | Why |
|----------|--------|-----|
| API response | JSON | Human-readable, universal |
| Kafka events | Avro | Schema registry, compact, evolution |
| Data lake storage | Parquet | Columnar, compressed, predicate pushdown |
| ML training data | Parquet/Arrow | Fast column reads, zero-copy |
| Config files | YAML/JSON | Human-editable |
| Log shipping | JSON Lines | Streamable, one record per line |
| Database backup | BSON (mongodump) | Native format, preserves types |
| Inter-service (gRPC) | Protobuf | Smallest, fastest, typed |

## Features & Feature Engineering

A **feature** is a measurable property of data used as input to a model or analysis — a column in your dataset that carries signal.

### Example

| Feature | Value | Type |
|---------|-------|------|
| `square_meters` | 120 | Numeric |
| `num_bedrooms` | 3 | Numeric |
| `has_garage` | true | Boolean |
| `neighborhood` | "downtown" | Categorical |
| `price` | 450000 | **Target** (what you predict) |

Everything except the target is a feature.

### Feature Engineering Techniques

| Technique | Raw → Feature | Example |
|-----------|--------------|---------|
| **Extraction** | Raw data → usable column | Timestamp → `hour_of_day`, `is_weekend` |
| **Transformation** | Scale/normalize | `price` → `log(price)`, min-max scaling |
| **Encoding** | Category → number | `"downtown"` → one-hot `[1,0,0]` |
| **Aggregation** | Multiple rows → one | Orders → `avg_order_value_30d` |
| **Interaction** | Combine features | `price / square_meters` = `price_per_sqm` |
| **Selection** | Drop irrelevant | Remove `customer_id` (no predictive value) |

### Feature Store

In production, a **feature store** manages features at scale:

```
Raw Data → Feature Pipeline → Feature Store → Model Training / Serving
  (Kafka)    (Spark/Flink)     (Feast/Tecton)   (batch / real-time)
```

Solves:

- **Consistency** — same feature definition for training and serving
- **Reuse** — teams share features instead of rebuilding
- **Time travel** — get feature values as of a past timestamp

Examples: Feast, Tecton, Hopsworks, AWS SageMaker Feature Store.

## Data Preparation Process

Data preparation transforms raw data into clean, structured data ready for analysis or ML. Typically 60-80% of a data engineer's work.

### Pipeline

```
Raw Data → Collect → Clean → Transform → Validate → Store → Serve
```

### 1. Data Collection (Ingestion)

| Method | Pattern | Example |
|--------|---------|---------|
| Batch | Scheduled bulk load | Daily CSV dump from ERP |
| Streaming | Real-time events | Kafka topic from IoT sensors |
| API pull | Request-response | REST API polling every 5 min |
| CDC | Change Data Capture | Debezium watching DB binlog |

### 2. Data Profiling

Understand what you have before cleaning: row count, column types, null percentages, value distributions, min/max, cardinality, anomalies.

### 3. Data Cleaning

| Problem | Technique |
|---------|-----------|
| Missing values | Drop, impute (mean/median/mode), forward-fill |
| Duplicates | Dedup by key, keep latest |
| Inconsistent formats | `"2026-04-21"` vs `"04/21/2026"` → standardize |
| Outliers | Z-score filter, IQR bounds, domain rules |
| Invalid values | Age = -5, email without `@` → reject or fix |
| Encoding issues | UTF-8 normalization, strip BOM |

### 4. Data Transformation

| Operation | What | Example |
|-----------|------|---------|
| **Normalization** | Scale to range | Min-max → [0,1] |
| **Standardization** | Zero mean, unit variance | Z-score |
| **Encoding** | Category → numeric | One-hot, label, target encoding |
| **Aggregation** | Summarize | Daily sales → monthly totals |
| **Joining** | Combine sources | Orders + Customers on `customer_id` |
| **Pivoting** | Reshape | Rows → columns (wide format) |
| **Binning** | Continuous → discrete | Age → `[0-18, 19-35, 36-60, 60+]` |
| **Derived features** | Create new columns | `revenue = price × quantity` |

### 5. Data Validation

| Check | Rule | Action on fail |
|-------|------|----------------|
| Schema | Column types match expected | Reject batch |
| Completeness | No nulls in required fields | Alert + impute |
| Freshness | Data arrived within SLA | Alert ops team |
| Volume | Row count within ±20% of expected | Investigate |
| Referential integrity | Foreign keys exist | Quarantine rows |
| Business rules | `price > 0`, `end_date > start_date` | Reject record |

### 6. Data Storage — Medallion Architecture

```
Bronze (raw)  →  Silver (cleaned)  →  Gold (business-ready)
  as-is            deduped, typed       aggregated, joined
  Parquet           Parquet/Delta        Parquet/Delta
  "data lake"       "data warehouse"     "data mart"
```

### Tools by Stage

| Stage | Tools |
|-------|-------|
| Ingestion | Kafka, Airbyte, Fivetran, Debezium |
| Profiling | Great Expectations, pandas-profiling, dbt |
| Cleaning | Spark, pandas, dbt |
| Transformation | Spark, dbt, Flink, SQL |
| Validation | Great Expectations, dbt tests, Soda |
| Orchestration | Airflow, Dagster, Prefect |
| Storage | S3/GCS + Parquet, Delta Lake, Iceberg |

## Data Serving

Data serving is the final mile — delivering prepared data to consumers (apps, dashboards, ML models, APIs).

### Serving Patterns

| Pattern | Latency | Consumer | Example |
|---------|---------|----------|---------|
| **Batch query** | Seconds–minutes | Analysts, BI | SQL on warehouse (Snowflake, BigQuery) |
| **Interactive query** | Sub-second | Dashboards | Presto/Trino, Druid, ClickHouse |
| **API serving** | Milliseconds | Applications | REST/GraphQL over cache or DB |
| **Embedded analytics** | Milliseconds | End users | Pre-computed aggregates in app DB |
| **ML model serving** | Milliseconds | Inference | Feature store → model endpoint |
| **Pub/Sub** | Real-time | Downstream systems | Kafka topic, Redis Streams |
| **Materialized views** | Near real-time | Mixed | Pre-joined, auto-refreshed tables |

### Serving Layer Architecture

```
Gold Layer (warehouse)
    ├── BI / Dashboards  ← SQL queries (Tableau, Grafana, Looker)
    ├── API Layer         ← REST/GraphQL (FastAPI, Express)
    │     └── Cache       ← Redis, CDN (reduce DB load)
    ├── ML Serving        ← Feature store → model (SageMaker, MLflow)
    ├── Search            ← Elasticsearch, OpenSearch
    └── Reverse ETL       ← Push data back to SaaS (Salesforce, HubSpot)
```

### Key Concepts

| Concept | What | Why |
|---------|------|-----|
| **Caching** | Store frequent results in memory | Reduce latency and DB load |
| **Pre-aggregation** | Compute summaries ahead of time | Dashboard loads in ms, not minutes |
| **Materialized views** | Auto-refreshed query results | Fresh data without full recompute |
| **Data API** | Expose data via REST/GraphQL | Decouple consumers from storage |
| **Reverse ETL** | Push warehouse data to operational tools | Sync analytics back to CRM, marketing |
| **Data contracts** | Schema + SLA between producer and consumer | Prevent breaking changes |

### Serving Trade-offs

| Dimension | Batch | Real-time |
|-----------|-------|-----------|
| Freshness | Minutes–hours | Seconds |
| Cost | Low (scheduled) | High (always-on) |
| Complexity | Simple | Complex (streaming infra) |
| Consistency | Strong (full recompute) | Eventual |
| Use case | Reports, training data | Alerts, live dashboards, fraud detection |

### Serving Tools

| Category | Tools |
|----------|-------|
| SQL warehouse | Snowflake, BigQuery, Redshift, Databricks SQL |
| Interactive query | Trino, Presto, Druid, ClickHouse |
| API gateway | Kong, AWS API Gateway, GraphQL mesh |
| Caching | Redis, Memcached, Varnish |
| ML serving | SageMaker, Vertex AI, MLflow, BentoML |
| Search | Elasticsearch, OpenSearch, Meilisearch |
| Reverse ETL | Census, Hightouch, Polytomic |

## Data Sampling

Selecting a representative subset from a large dataset to reduce cost/time while preserving statistical properties.

### Sampling Methods

| Method | How | When to use |
|--------|-----|-------------|
| **Random** | Each row has equal probability | General purpose, balanced data |
| **Stratified** | Sample proportionally from each group | Imbalanced classes (95% normal, 5% fraud) |
| **Systematic** | Every k-th row | Ordered data, quick approximation |
| **Cluster** | Randomly select entire groups | Data naturally grouped (by region, store) |
| **Reservoir** | Fixed-size sample from stream | Streaming data, unknown total size |
| **Weighted** | Higher probability for important rows | Rare events, cost-sensitive |

### Python Examples

```python
import pandas as pd

df = pd.read_parquet("large_dataset.parquet")

# Random: 10% of rows
sample = df.sample(frac=0.10, random_state=42)

# Fixed count: exactly 1000 rows
sample = df.sample(n=1000, random_state=42)

# Stratified: preserve class distribution
from sklearn.model_selection import train_test_split
train, test = train_test_split(df, test_size=0.2, stratify=df["label"])

# Systematic: every 10th row
sample = df.iloc[::10]

# Weighted: oversample rare class
weights = df["label"].map({0: 1, 1: 10})
sample = df.sample(n=1000, weights=weights, random_state=42)
```

### Reservoir Sampling (streaming)

```python
import random

def reservoir_sample(stream, k):
    """Keep k items from unknown-length stream."""
    reservoir = []
    for i, item in enumerate(stream):
        if i < k:
            reservoir.append(item)
        else:
            j = random.randint(0, i)
            if j < k:
                reservoir[j] = item
    return reservoir
```

### Sampling Pitfalls

| Pitfall | Problem | Fix |
|---------|---------|-----|
| Selection bias | Sample doesn't represent population | Use stratified sampling |
| Too small | High variance, unreliable stats | Calculate minimum sample size |
| Time bias | Only recent data sampled | Include historical range |
| Survivorship bias | Only successful cases in sample | Include failures/dropouts |

## Data Processing

The compute-heavy middle stage — transforming cleaned data into analysis-ready outputs.

```
Prepared Data → Filter → Join → Aggregate → Enrich → Compute → Output
```

### Core Steps

| Step | What | Example |
|------|------|---------|
| **Filtering** | Remove irrelevant rows/columns | `WHERE date >= '2026-01-01'` |
| **Joining** | Combine datasets by key | Orders + Products on `product_id` |
| **Aggregation** | Group + summarize | `SUM(revenue) GROUP BY region, month` |
| **Enrichment** | Add external data | Append weather data to sales by date+location |
| **Deduplication** | Remove duplicate records | Keep latest by `updated_at` per `id` |
| **Sorting** | Order for downstream use | Sort by timestamp for time-series |
| **Partitioning** | Split by key for parallel processing | Partition by `date` or `region` |
| **Windowing** | Compute over sliding ranges | 7-day rolling average, rank within group |
| **Pivoting** | Reshape rows ↔ columns | Long → wide format for reporting |
| **Derived columns** | Compute new fields | `profit = revenue - cost` |

### Processing Paradigms

| Paradigm | When | Tools |
|----------|------|-------|
| **Batch** | Process all data at once (hourly/daily) | Spark, Hive, dbt, SQL |
| **Micro-batch** | Small frequent batches (seconds) | Spark Structured Streaming |
| **Stream** | Process each event as it arrives | Flink, Kafka Streams, Beam |
| **Interactive** | Ad-hoc queries by humans | Trino, Presto, BigQuery |

### ETL vs ELT

| | ETL | ELT |
|---|-----|-----|
| **Transform where** | Before loading (pipeline) | After loading (in warehouse) |
| **Tools** | Spark, Informatica | dbt, SQL in Snowflake/BigQuery |
| **Trend** | Legacy | Modern (warehouse is powerful enough) |

### Processing Frameworks

| Framework | Language | Batch | Stream | Scale |
|-----------|----------|:-----:|:------:|-------|
| **Spark** | Python/Scala/SQL | ✅ | ✅ | Massive |
| **Flink** | Java/Python/SQL | ✅ | ✅ (best) | Massive |
| **dbt** | SQL | ✅ | ❌ | Warehouse-bound |
| **Pandas** | Python | ✅ | ❌ | Single machine |
| **Polars** | Python/Rust | ✅ | ❌ | Single machine (fast) |
| **Beam** | Java/Python | ✅ | ✅ | Portable (Spark/Flink/Dataflow) |
