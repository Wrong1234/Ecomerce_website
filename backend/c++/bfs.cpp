#include<bits/stdc++.h>
using namespace std;
#define N = 1e5
vector<int>visited[N + 2];

int dfs(int node){
    
    queue<int>q;
    
    q.push(node);
    visited[node] = true;

    while(!q.empty()){
        
        int ele = q.front();
        q.pop();

        cout << ele << " ";

        for(auto u : adj[ele]){
            if(!visited[u]){
                visited[u] = true;
                q.push(u);
            }
        }
    }
}

void solve(){

    int  n;
    cin >> n;
    vector<int>adj[n + 1];
    for(int i = 0; i < n; i++){
        int x, y;
        cin >> x >> y;
    }

    dfs(0);
}

int main(){

    int t;
    cin >> t;
    
    while(t--) solve();
}