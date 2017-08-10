import { Component, Prop, State } from '@stencil/core';
import { LoadingController, ModalController } from '@ionic/core';

@Component({
  tag: 'news-list'
})
export class NewsList {

  apiRootUrl: string = 'https://node-hnapi.herokuapp.com';

  @Prop() storyList: any[];
  @Prop({ connect: 'ion-loading-ctrl' }) loadingCtrl: LoadingController;
  @Prop({ connect: 'ion-modal-ctrl' }) modalCtrl: ModalController;

  @State() fakeData: any[] = [];

  comments(story: any) {
    // if (Ionic.isServer) return;

    /*setTimeout(() => {
          loading.dismiss().then(() => {
            Ionic.controller('modal', { component: 'comments-page', componentProps: { comments: data.comments, storyId: story.id } }).then(modal => {
              console.log('modal created');

              modal.present().then(() => {
                console.log('modal finished transitioning in, commments: ', modal.componentProps.comments);
              });
            });
          });
        }, 300);*/

    this.loadingCtrl.create({ content: 'fetching comments...' }).then(loading => {
      loading.present().then(() => {
        fetch(`${this.apiRootUrl}/item/${story.id}`).then((response: any) => {
          return response.json()
        }).then((data) => {
          loading.dismiss().then(() => {
            this.modalCtrl.create({ component: 'comments-page', componentProps: { comments: data.comments, storyId: story.id } }).then((modal => {
              modal.present().then(() => {
                console.log('modal finished transitioning in, commments: ', modal.componentProps.comments);
              })
            }))
          })
        })
      })
    });
  }

  render() {
    if (this.storyList !== undefined) {
      const items = this.storyList.map((story: any) => {
        return (
          <ion-item>
            <div class='points' slot='start'>
              {story.points || 0}
            </div>
            <ion-label>
              <h2 class='list-header'>
                <a href={story.url}>{story.title}</a>
              </h2>
              <h3 class='comments-text' onClick={() => this.comments(story)}>
                Posted by {story.user} {story.time_ago} | {story.comments_count} comments
            </h3>
            </ion-label>
          </ion-item>
        )
      })

      return (
        <ion-list>
          {items}
        </ion-list>
      )
    } else {
      return (
        <ion-list>
          {Array.from(Array(10)).map(() =>
            <ion-item>
              <div class='points' slot='start'>
                <ion-skeleton-text width='20px'></ion-skeleton-text>
              </div>
              <ion-label>
                <h2 class='list-header'>
                  <ion-skeleton-text width='90%'></ion-skeleton-text>
                  <ion-skeleton-text width='85%'></ion-skeleton-text>
                </h2>
                <h3 class='comments-text'>
                  <ion-skeleton-text width='60%'></ion-skeleton-text>
                </h3>
              </ion-label>
            </ion-item>
          )}
        </ion-list>
      )
    }
  }
}
