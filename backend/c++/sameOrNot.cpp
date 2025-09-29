#include<bits/stdc++.h>

using namespace std;

struct TreeNode{

    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(NULL), right(NULL){}
}

bool isSame(TreeNode*root1, TreeNode*root2){
        if(root1 == NULL and root2 == NULL) return true;
        if(root1 == NULL || root2 == NULL) return false;

        return (root1->val == root2->val)
                && isSame(root1->left, root2->left)
                && isSame(root1->right, root2->right)
    }

int main(){
    TreeNode* a = new TreeNode(1);
    a->left = new TreeNode(2);
    a->right = new TreeNode(3);

    TreeNode* b = new TreeNode(1);
    b->left = new TreeNode(2);
    b->right = new TreeNode(3);

    if(isSame(a, b)) printf("Trees are the same\n");
    else printf("Trees are different");
    return 0;
}