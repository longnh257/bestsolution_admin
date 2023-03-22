module.exports = Object.freeze({

      NOTIFICATION_APPOINTMENT: 'APPOINTMENT',
      NOTIFICATION_AUTH_OWNER: 'AUTH_OWNER',
      // notification
      CUSTOMER_CREATE_APPOINTMENT: 1,
      ADMIN_START_APPOINTMENT : 2,
      ADMIN_FINISH_APPOINTMENT : 3,
      ADMIN_CANCEL_APPOINTMENT : 4,
      ADMIN_DELETE_APPOINTMENT : 5,
      ADMIN_CREATE_APPOINTMENT : 6,
      ADMIN_UPDATE_APPOINTMENT : 7,
      ADMIN_UPDATE_APPOINTMENT_TO_WAITING : 8,
      ADMIN_ACCEPTED_APPOINTMENT : 9,
      ADMIN_REJECTED_APPOINTMENT : 10,
      CUSTOMER_CANCEL_APPOINTMENT : 11,
      ADMIN_REMIND_CUSTOMER : 12,
      ADMIN_REMIND_CUSTOMER_OVERTIME : 13,
      CUSTOMER_FEEDBACK : 14,
      APPROVE_OWNER : 15,
      ACTIVE_OWNER : 16,
      INACTIVE_OWNER : 17,
      // -------------------------------

      APM_PENDING: 1,
      APM_WAITING: 2,
      APM_IN_PROCESSING: 3,
      APM_FINISH: 4,
      APM_CANCEL: 5,
      APM_DELETED: 6,
      APM_ACCEPTED : 7,

      STAFF_AVAILABLE: 1,
      STAFF_BREAK: 2,
      STAFF_WORKING: 3,

      GENDER_MALE : 1,
      GENDER_FEMALE : 2,
      GENDER_OTHER : 3,

      READ : 1,
      NOT_READ: 0,

      DEVICE_ANDROID: 'android',
      DEVICE_IOS: 'ios',

      TYPE_APPOINTMENT_WALK_IN : 1,
      TYPE_APPOINTMENT_CUSTOMER : 2,

      APM_CANCELED_BY_ADMIN: 1,
      APM_CANCELED_BY_CUSTOMER: 2,

      CUSTOMER_NAME_DEFAULT: 'GUEST',

      ACCEPTED_APPOINTMENT : 1,
      REJECTED_APPOINTMENT: 0,

      ACTIVE: 1,
      NOT_ACTIVE: 0,

      LOGIN_TYPE_CHECK_IN : 'check-in',
      LOGIN_TYPE_LOGIN : 'login',

      TYPE_ACTION_OWNER_ADD_NEW_APPOINTMENT: 'new-appointment',
      TYPE_ACTION_OWNER_UPDATE_APPOINTMENT: 'update-appointment',
      TYPE_ACTION_WAITING_APPOINTMENT: 'waiting-appointment',
      TYPE_ACTION_START_APPOINTMENT: 'start-appointment',
      TYPE_ACTION_COMPLETE_APPOINTMENT: 'complete-appointment',
      TYPE_ACTION_CANCEL_APPOINTMENT: 'cancel-appointment',
      TYPE_ACTION_CHANGE_STAFF_APPOINTMENT: 'change-staff',
      TYPE_ACTION_REMIND_APPOINTMENT: 'remind-appointment',
      TYPE_ACTION_HANDLE_APPOINTMENT: 'handle-appointment',
      TYPE_ACTION_CUSTOMER_ADD_NEW_APPOINTMENT: 'customer-add-appointment',
      TYPE_ACTION_CUSTOMER_FEEDBACK_APPOINTMENT: 'customer-feedback-appointment',

      MINUTES_APPROVE_BOOKING_WITH_NOW : 30,

      REMOVE_APPOINTMENT_BY_ADMIN: 1,
      REMOVE_APPOINTMENT_BY_CLIENT: 2,

      CUSTOMER_SEND_VERIFY_CODE: 1,
      OWNER_SEND_VERIFY_CODE: 2,

      INACTIVE: 0,

      MULTER_ERROR: {
            LIMIT_PART_COUNT: 'Too many parts',
            LIMIT_FILE_SIZE: 'File too large',
            LIMIT_FILE_COUNT: 'Too many files',
            LIMIT_FIELD_KEY: 'Field name too long',
            LIMIT_FIELD_VALUE: 'Field value too long',
            LIMIT_FIELD_COUNT: 'Too many fields',
            LIMIT_UNEXPECTED_FILE: 'Unexpected field',
            MISSING_FIELD_NAME: 'Field name missing'
      },

      FOLDER_IMAGE_SALON: 'salons',
      FOLDER_IMAGE_STAFF: 'staffs',
      FOLDER_IMAGE_SERVICE: 'services',
      FOLDER_IMAGE_FEEDBACK: 'feedbacks',
      FOLDER_IMAGE_BANNER: 'banners',
      FOLDER_IMAGE_VOUCHER: 'vouchers',
      FOLDER_IMAGE_BOOKING: 'bookings',
      FOLDER_IMAGE_SUPPORT: 'supports',
      FOLDER_IMAGE_JOB: 'jobs',
      FOLDER_IMAGE_PROFILE: 'profiles',
      FOLDER_NONE: 'none',

      TYPE_BEFORE : 1,
      TYPE_AFTER: 2,

      BANNER_INTRO: 1,
      BANNER_ADS: 2,
      BANNER_GUIDE: 3,
      BANNER: 4,

      HAPPENING : 1,
      UPCOMING : 2,
      EXPIRED : 3,

      TYPE_COUPON : 1,
      TYPE_VOUCHER: 2,


      ALL_CUSTOMER: 1,
      CUSTOMER_NORMAL : 2,
      CUSTOMER_VIP : 3,


      TYPE_UPLOAD_AVATAR_STAFF: 1,
      TYPE_UPLOAD_AVATAR_SERVICE: 2,

      TYPE_OPTION_REQUEST_IMPORT_INFO : 1,

      PATTERN_REGEX_NAME : /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\\s_. ]+$/,

      PUBLISH_JOB : 1,
      UN_PUBLISH_JOB : 0,

      POSITION_MANAGER : 1,
      POSITION_MAIN_WORKER : 2,
      POSITION_ASSISTANT_WORKER: 3,

      SHORT_TERM : 1,
      LONG_TERM : 2,

      STATUS_ONLINE : 1,
      STATUS_OFFLINE : 0,

})