import os
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "alvin999")
DATA_PATH = Path(__file__).parent.parent.parent / "web" / "src" / "data" / "projects.json"

def sync_projects():
    # 1. Fetch GitHub Projects
    print(f"Fetching GitHub projects for {GITHUB_USERNAME}...")
    gh_headers = {"Accept": "application/vnd.github.v3+json"}
    gh_token = os.getenv("GITHUB_TOKEN")
    if gh_token:
        gh_headers["Authorization"] = f"token {gh_token}"
        
    with httpx.Client() as client:
        gh_resp = client.get(
            f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=stars&per_page=100",
            headers=gh_headers,
            follow_redirects=True
        )
        if gh_resp.status_code != 200:
            print(f"Failed to fetch from GitHub (Status: {gh_resp.status_code}): {gh_resp.text}")
            return
        repos = gh_resp.json()
        
    print(f"Found {len(repos)} repositories.")

    # 2. Process records
    projects = []
    for repo in repos:
        if repo.get("fork"):
            continue

        project = {
            "id": str(repo["id"]),
            "name": repo["name"],
            "description": repo.get("description") or "",
            "url": repo.get("homepage") or repo.get("html_url"),
            "github_repo": repo.get("html_url"),
            "stars": repo.get("stargazers_count", 0),
            "language": repo.get("language") or "",
            "is_featured": repo.get("stargazers_count", 0) > 0
        }
        projects.append(project)

    # 3. Save to JSON
    print(f"Saving {len(projects)} projects to {DATA_PATH}...")
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)

    print("Sync complete.")

if __name__ == "__main__":
    sync_projects()
