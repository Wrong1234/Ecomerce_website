#include<stdio.h>
#include<stdlib.h>

struct Node{
    int data;
    struct Node* next;
}

struct Node* newNode(int data){
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    node->data = data;
    node->next = null;
    return node;
}

void traverse(struct Node* head){
    struct Node* current = head;

    while(current != NULL){
        printf("%d ->", current->data);
        current = current->next;
    }

    printf("NULL\n");
}


int main(){
   struct Node* head = NULL;
   struct Node* tail = NULL;

   int n , val;
   scanf("%d", &n);

   for(int i = 0; i <= n; i++){
    scanf("%d", &val);
    struct Node* temp = newNode(val);

    if(head == NULL){
        head = temp;
        tail = temp;
    }
    else{
        tail->next = temp;
    }
    printf("Linked list: \n")
    traverse(head);
   }
}