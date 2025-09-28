#include<stdio.h>
#include<bits/stdc++.h>

using namespace std;

void solve(){

    int n;
    cin >> n;

    int arr[n + 3];
    for(int i = 0; i < n; i++) cin >> arr[i];

    std :: vector<int>v;
    for(int i = 0; i < n; i++){
        if(arr[i] > v.back()) v.push_back(arr[i]);
        else{
            int idx = lower_bound(v.begin(), v.end(), arr[i]) - v.begin();
            v[idx] = arr[i];
        }
    }
    for(int i = 0 ; i < v.size(); i++) cout << v[i] << " ";
    cout << endl;

}


int main(){
    int t;
    cin >> t;
    

    while(t--) solve();
}