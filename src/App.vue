<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

/**
 * 应用启动：App 端请求相册等系统权限
 */
onLaunch(() => {
  console.log('前端极客工具箱已启动')

  // #ifdef APP-PLUS
  requestAppPermissions()
  // #endif
})

onShow(() => {})
onHide(() => {})

// #ifdef APP-PLUS
/**
 * 检查并请求 App 端必要权限（相册、相机等）
 */
function requestAppPermissions() {
  const permissions = [
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.CAMERA',
  ]

  // Android 动态权限申请
  // #ifdef APP-PLUS && APP-ANDROID
  plus.android.requestPermissions(
    permissions,
    (result) => {
      const granted = result.granted || []
      const denied = result.deniedPresent || []
      if (denied.length > 0) {
        uni.showModal({
          title: '权限提示',
          content: '图片压缩等功能需要相册与相机权限，请在系统设置中开启。',
          showCancel: false,
        })
      } else if (granted.length > 0) {
        console.log('Android 权限已授予')
      }
    },
    (err) => {
      console.error('权限申请失败', err)
    }
  )
  // #endif

  // iOS 在首次 chooseImage 时由系统弹窗授权，此处可做预检提示
  // #ifdef APP-PLUS && APP-IOS
  console.log('iOS 将在使用相册/相机时由系统请求授权')
  // #endif
}
// #endif
</script>

<style lang="scss">
@import './uni.scss';

page {
  background-color: $bg-color;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  font-size: 28rpx;
  color: $text-color;
}
</style>
