Absolutely! Here is a complete, ready-to-use **README.md** file for your RSS Feed Aggregator CLI project:

---

```markdown
# RSS Feed Aggregator CLI

A Node.js command-line tool for managing users, feeds, and following RSS feeds.  
Supports multi-user registration, feed management, and per-user following.

---

## Features

- Register and log in users
- Add RSS feeds by name and URL
- Follow and unfollow feeds per user
- List feeds a user is following
- Stores posts from feeds for each user
- Supports multiple users and feeds

---

## Installation

1. **Clone the repository:**
    ```
    git clone https://github.com/yourusername/rss-aggregator-cli.git
    cd rss-aggregator-cli
    ```

2. **Install dependencies:**
    ```
    npm install
    ```

3. **Configure your environment:**
    - Copy `.env.example` to `.env` and fill in your database connection details.

---

## Usage

All commands are run via:

```
npm run start  [arguments...]
```

### **Available Commands**

#### Reset the Database

```
npm run start reset
```

#### Register a User

```
npm run start register 
```
_Example:_
```
npm run start register kahya
```

#### Add a Feed

```
npm run start addfeed "" ""
```
_Example:_
```
npm run start addfeed "Hacker News RSS" "https://hnrss.org/newest"
```

#### Follow a Feed

```
npm run start follow ""
```
_Example:_
```
npm run start follow "https://hnrss.org/newest"
```

#### List Following Feeds

```
npm run start following
```
_Shows all feeds the current user is following._

#### Login as a User

```
npm run start login 
```
_Example:_
```
npm run start login kahya
```

---

## Example Workflow

```
npm run start reset
npm run start register kahya
npm run start addfeed "Hacker News RSS" "https://hnrss.org/newest"
npm run start register holgith
npm run start addfeed "Lanes Blog" "https://www.wagslane.dev/index.xml"
npm run start follow "https://hnrss.org/newest"
npm run start following
# Output should include:
# Hacker News RSS
# Lanes Blog

npm run start login kahya
npm run start following
# Output should include:
# Hacker News RSS
# Output should NOT include:
# Lanes Blog
```

---

## Configuration

- Set up your database connection in `.env`.
- Supported environment variables:
    - `DATABASE_URL`
    - (Add others as needed for your setup)

---

