import cv2
import face_recognition

def main():
    known_image = face_recognition.load_image_file("image/jo/0jo2.jpg")
    unknown_image = face_recognition.load_image_file("image/jo/0jo9.jpg")

    biden_encoding = face_recognition.face_encodings(known_image)[0]
    unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

    face_distances = face_recognition.face_distance([biden_encoding], unknown_encoding)

    for face_distance in face_distances:
        if face_distance >= 0.4:
            return False
if __name__ == "__main__":
    main()
