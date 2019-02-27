import os
from datetime import datetime
import matplotlib.pyplot as plt
from keras.applications import InceptionV3
from keras.callbacks import ModelCheckpoint, EarlyStopping, TensorBoard
from keras.engine.saving import load_model
from keras.layers import np, Dense, Dropout, GlobalAveragePooling2D
from keras.models import Model
from keras.preprocessing import image
from keras_applications.inception_v3 import preprocess_input
from keras_preprocessing.image import ImageDataGenerator

MODEL_SAVE_FOLDER_PATH = './model/'
model_path = MODEL_SAVE_FOLDER_PATH + 'test.h5'
IMAGE_SIZE = (299, 299)


def visualize_data(positive_images, negative_images):
    # INPUTS
    # positive_images - Images where the label = 1 (True)
    # negative_images - Images where the label = 0 (False)

    figure = plt.figure()
    count = 0
    for i in range(positive_images.shape[0]):
        count += 1
        figure.add_subplot(2, positive_images.shape[0], count)
        plt.imshow((positive_images[i, :, :] * 255).astype(np.uint8))
        plt.axis('off')
        plt.title("1")

        figure.add_subplot(1, negative_images.shape[0], count)
        plt.imshow((negative_images[i, :, :] * 255).astype(np.uint8))
        plt.axis('off')
        plt.title("0")
    plt.show()


def load_image():
    IMAGE_PATH = './image'

    BATCH_SIZE = 10

    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest')

    validation_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest')

    train_generator = train_datagen.flow_from_directory(IMAGE_PATH,
                                                        target_size=IMAGE_SIZE,
                                                        batch_size=BATCH_SIZE,
                                                        class_mode='categorical')
    validation_generator = validation_datagen.flow_from_directory(
        IMAGE_PATH,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical')
    # file_paths = glob.glob(path.join(IMAGE_PATH, '**', '*.jpg'))
    # images = np.asarray([image.img_to_array(image.load_img(path, target_size=IMAGE_SIZE)) for path in file_paths])
    # image_size = images.shape[0]
    # read_labels = [path.split(os.path.sep)[-2] for path in file_paths]
    # set_label = list(set(read_labels))
    # labels = np.zeros((BATCH_SIZE,images.shape[0]))
    # for i in range(image_size):
    #     labels[i] = set_label.index(read_labels[i])
    #
    # TRAIN_TEST_SPLIT = 0.9
    # split_index = int(TRAIN_TEST_SPLIT * image_size)
    # shuffled_indices = np.random.permutation(image_size)
    # train_indices = shuffled_indices[0:split_index]
    # test_indices = shuffled_indices[split_index:]
    #
    # x_train = images[train_indices, :, :, :]
    # y_train = labels[train_indices]
    # x_test = images[test_indices, :, :, :]
    # y_test = labels[test_indices]

    # return [(x_train, y_train), (x_test, y_test)]
    return (train_generator, validation_generator)


def make_model():
    base_model = InceptionV3(include_top=False)
    x = base_model.output
    x = GlobalAveragePooling2D(name='avg_pool')(x)
    x = Dropout(0.4)(x)
    last_layer = Dense(2, activation='softmax')(x)
    model = Model(inputs=base_model.input, outputs=last_layer)

    model.compile(loss='categorical_crossentropy', optimizer='rmsprop', metrics=['accuracy'])

    model.summary()
    return model


def train():
    LOG_DIRECTORY_ROOT = 'log'
    EPOCHS = 5

    now = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    if not os.path.exists(MODEL_SAVE_FOLDER_PATH):
        os.mkdir(MODEL_SAVE_FOLDER_PATH)

    log_dir = "{}/run-{}/".format(LOG_DIRECTORY_ROOT, now)
    cb_checkpoint = ModelCheckpoint(filepath=model_path, monitor='val_loss', verbose=1, save_best_only=True)
    cb_early_stopping = EarlyStopping(monitor='val_loss', patience=1)
    tensorboard = TensorBoard(log_dir=log_dir, write_grads=True, write_images=True)

    model = make_model()

    generator = load_image()

    history = model.fit_generator(generator[0],
                                  validation_data=generator[1],
                                  epochs=EPOCHS,
                                  steps_per_epoch=10,
                                  validation_steps=5,
                                  callbacks=[cb_early_stopping, cb_checkpoint, tensorboard])
    plot_training(history)


def plot_training(history):
    acc = history.history['acc']
    val_acc = history.history['val_acc']
    loss = history.history['loss']
    val_loss = history.history['val_loss']
    epochs = range(len(acc))

    plt.plot(epochs, acc, 'r.')
    plt.plot(epochs, val_acc, 'r')
    plt.title('Training and validation accuracy')

    plt.figure()
    plt.plot(epochs, loss, 'r.')
    plt.plot(epochs, val_loss, 'r-')
    plt.title('Training and validation loss')
    plt.show()


def predict(model, img):
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    preds = model.predict(x)
    return preds[0]


def plot_preds(img, preds):
    """Displays image and the top-n predicted probabilities in a bar graph
    Args:
        preds: list of predicted labels and their probabilities
    """
    plt.imshow(np.asarray(img))
    plt.show();


def test():
    model = load_model(model_path)
    img = image.load_img('image/jo/irene.jpg', target_size=IMAGE_SIZE)
    preds = predict(model, img)
    print(preds)
    plot_preds(np.asarray(img), preds)


# train()
test()
