#include<bits/stdc++.h>
using namespace std;

#define INF = 1e18

void djk(vector<pair<int, int>>adj[], int n, int src){
    
    std :: vector dist(n + 1, INF);
    std :: vector <bool> visit(n + 1, false);

    dist[src] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>>pq;

    pq.push(0, src);
    while(!pq.empty()){
        int u = pq.top().second;
        pq.pop();

        if(visit[u]) continue;
        visit[u] = true;
        for(auto edge : adj[u]){
            int v = edge.first;
            int w = edge.second;

            if(dist[u] + w <dist[v]){
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
        
        for(int i = 0; i < n; i++) cout << dist[i] << " ";
        cout << endl;
    }

}


void solve(){
    int n , m;
    
    cin >> n >> m;

    vector<pair<int, int>> adj[n + 2];
    for(int i = 0; i < n; i++){
        int x , y, w;

        cin >> x >> y >> w;
        adj[x].push_back({y, w});
    }
    djk(adj, n, 1);

    int main(){

        int t = 1;
        cin >> t;
        while(t--) solve();
    }
}