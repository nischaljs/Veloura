# Search & Filter Routes

Base path: `/search`

## GET /search
Search products with advanced filtering.

**Query Parameters:**
- `q` (string): Search query
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Category slug
- `brand` (string): Brand slug
- `vendor` (string): Vendor slug
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `rating` (number): Minimum rating
- `sort` (string): Sort by (relevance, price, rating, newest, popularity)
- `order` (string): Sort order (asc, desc)
- `inStock` (boolean): In stock products only
- `featured` (boolean): Featured products only
- `attributes` (object): Filter by product attributes
- `tags` (string): Filter by tags (comma-separated)

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "smartphone",
    "products": [
      {
        "id": 1,
        "name": "Smartphone Pro",
        "slug": "smartphone-pro",
        "description": "Latest smartphone with advanced features",
        "price": 25000.00,
        "salePrice": 22000.00,
        "rating": 4.5,
        "reviewCount": 125,
        "image": "https://example.com/smartphone.jpg",
        "vendor": {
          "businessName": "Tech Store",
          "slug": "tech-store"
        },
        "category": {
          "name": "Electronics",
          "slug": "electronics"
        },
        "brand": {
          "name": "TechBrand",
          "slug": "techbrand"
        },
        "tags": ["trending", "new"],
        "attributes": {
          "Color": "Black",
          "Storage": "128GB"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 150,
      "pages": 13
    },
    "filters": {
      "categories": [
        {
          "id": 1,
          "name": "Electronics",
          "count": 100
        },
        {
          "id": 2,
          "name": "Smartphones",
          "count": 50
        }
      ],
      "brands": [
        {
          "id": 1,
          "name": "TechBrand",
          "count": 30
        }
      ],
      "vendors": [
        {
          "id": 1,
          "businessName": "Tech Store",
          "count": 25
        }
      ],
      "priceRange": {
        "min": 1000,
        "max": 50000
      },
      "attributes": {
        "Color": ["Black", "White", "Blue"],
        "Storage": ["64GB", "128GB", "256GB"]
      },
      "tags": ["trending", "new", "popular"]
    },
    "suggestions": [
      "smartphone case",
      "smartphone charger",
      "smartphone screen protector"
    ]
  }
}
```

## GET /search/suggestions
Get search suggestions.

**Query Parameters:**
- `q` (string): Search query
- `limit` (number): Number of suggestions

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "product",
        "text": "Smartphone Pro",
        "slug": "smartphone-pro",
        "image": "https://example.com/smartphone.jpg"
      },
      {
        "type": "category",
        "text": "Smartphones",
        "slug": "smartphones"
      },
      {
        "type": "brand",
        "text": "TechBrand",
        "slug": "techbrand"
      },
      {
        "type": "query",
        "text": "smartphone case"
      }
    ]
  }
}
```

## GET /search/autocomplete
Get search autocomplete results.

**Query Parameters:**
- `q` (string): Search query
- `limit` (number): Number of results

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Smartphone Pro",
        "slug": "smartphone-pro",
        "price": 25000.00,
        "image": "https://example.com/smartphone.jpg"
      }
    ],
    "categories": [
      {
        "id": 1,
        "name": "Smartphones",
        "slug": "smartphones"
      }
    ],
    "brands": [
      {
        "id": 1,
        "name": "TechBrand",
        "slug": "techbrand"
      }
    ]
  }
}
```

## GET /search/filters
Get available search filters.

**Query Parameters:**
- `q` (string): Search query
- `category` (string): Category slug

**Response:**
```json
{
  "success": true,
  "data": {
    "filters": {
      "categories": [
        {
          "id": 1,
          "name": "Electronics",
          "count": 100,
          "children": [
            {
              "id": 2,
              "name": "Smartphones",
              "count": 50
            }
          ]
        }
      ],
      "brands": [
        {
          "id": 1,
          "name": "TechBrand",
          "count": 30
        }
      ],
      "vendors": [
        {
          "id": 1,
          "businessName": "Tech Store",
          "count": 25
        }
      ],
      "priceRanges": [
        {
          "min": 0,
          "max": 5000,
          "count": 20
        },
        {
          "min": 5000,
          "max": 15000,
          "count": 50
        },
        {
          "min": 15000,
          "max": 50000,
          "count": 80
        }
      ],
      "ratings": [
        {
          "rating": 5,
          "count": 60
        },
        {
          "rating": 4,
          "count": 40
        },
        {
          "rating": 3,
          "count": 30
        }
      ],
      "attributes": {
        "Color": [
          {
            "value": "Black",
            "count": 40
          },
          {
            "value": "White",
            "count": 30
          }
        ],
        "Storage": [
          {
            "value": "128GB",
            "count": 50
          },
          {
            "value": "256GB",
            "count": 30
          }
        ]
      },
      "availability": [
        {
          "value": "in_stock",
          "count": 120
        },
        {
          "value": "out_of_stock",
          "count": 30
        }
      ]
    }
  }
}
```

## GET /search/trending
Get trending search terms.

**Query Parameters:**
- `limit` (number): Number of trending terms
- `period` (string): Period (7d, 30d, 90d)

**Response:**
```json
{
  "success": true,
  "data": {
    "trending": [
      {
        "term": "smartphone",
        "count": 1500,
        "trend": "up"
      },
      {
        "term": "laptop",
        "count": 1200,
        "trend": "up"
      },
      {
        "term": "headphones",
        "count": 800,
        "trend": "down"
      }
    ]
  }
}
```

## GET /search/popular
Get popular search terms.

**Query Parameters:**
- `limit` (number): Number of popular terms
- `category` (string): Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "popular": [
      {
        "term": "smartphone",
        "count": 5000
      },
      {
        "term": "laptop",
        "count": 3000
      },
      {
        "term": "headphones",
        "count": 2000
      }
    ]
  }
}
```

## GET /search/recent
Get recent search terms (requires authentication).

**Query Parameters:**
- `limit` (number): Number of recent terms

**Response:**
```json
{
  "success": true,
  "data": {
    "recent": [
      {
        "term": "smartphone case",
        "searchedAt": "2024-01-15T10:30:00Z"
      },
      {
        "term": "laptop charger",
        "searchedAt": "2024-01-14T15:20:00Z"
      }
    ]
  }
}
```

## POST /search/log
Log search query (for analytics).

**Request Body:**
```json
{
  "query": "smartphone",
  "filters": {
    "category": "electronics",
    "minPrice": 1000,
    "maxPrice": 50000
  },
  "resultsCount": 150,
  "clickedProductId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Search logged successfully"
}
```

## GET /search/analytics
Get search analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalSearches": 10000,
      "uniqueSearches": 5000,
      "averageResults": 45,
      "clickThroughRate": 15.5,
      "topSearches": [
        {
          "term": "smartphone",
          "count": 1500,
          "clickThroughRate": 20.5
        }
      ],
      "searchTrends": [
        {
          "date": "2024-01-15",
          "searches": 500,
          "uniqueSearches": 300
        }
      ],
      "categorySearches": [
        {
          "category": "Electronics",
          "searches": 3000,
          "clickThroughRate": 18.5
        }
      ]
    }
  }
}
```

## Advanced Search Routes

### GET /search/advanced
Advanced product search with complex filters.

**Query Parameters:**
- `q` (string): Search query
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Category slug
- `brand` (string): Brand slug
- `vendor` (string): Vendor slug
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `rating` (number): Minimum rating
- `sort` (string): Sort by
- `order` (string): Sort order
- `attributes` (object): Complex attribute filters
- `tags` (string): Tag filters
- `dateFrom` (string): Products added from date
- `dateTo` (string): Products added to date
- `weight` (object): Weight range filter
- `dimensions` (object): Dimension filters

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "smartphone",
    "filters": {
      "applied": {
        "category": "electronics",
        "minPrice": 1000,
        "maxPrice": 50000,
        "rating": 4
      }
    },
    "products": [
      {
        "id": 1,
        "name": "Smartphone Pro",
        "slug": "smartphone-pro",
        "price": 25000.00,
        "salePrice": 22000.00,
        "rating": 4.5,
        "reviewCount": 125,
        "image": "https://example.com/smartphone.jpg",
        "vendor": {
          "businessName": "Tech Store",
          "slug": "tech-store"
        },
        "category": {
          "name": "Electronics",
          "slug": "electronics"
        },
        "brand": {
          "name": "TechBrand",
          "slug": "techbrand"
        },
        "attributes": {
          "Color": "Black",
          "Storage": "128GB",
          "RAM": "8GB"
        },
        "weight": 180,
        "dimensions": {
          "length": 15,
          "width": 7,
          "height": 0.8
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 150,
      "pages": 13
    }
  }
}
```

### GET /search/similar/:productId
Find similar products.

**Query Parameters:**
- `limit` (number): Number of similar products

**Response:**
```json
{
  "success": true,
  "data": {
    "similarProducts": [
      {
        "id": 2,
        "name": "Similar Smartphone",
        "slug": "similar-smartphone",
        "price": 23000.00,
        "rating": 4.3,
        "image": "https://example.com/similar.jpg",
        "similarityScore": 0.85
      }
    ]
  }
}
``` 