import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import axios from 'axios';
import { buildUrl } from 'cloudinary-build-url';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/Home.module.scss';

export default function Home(props) {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dbyiupffc',
    },
  });

  const propertyNames = Object.values(props);
  console.log('HELLO', propertyNames);

  const url = buildUrl(`[${imageSrc}]`, {
    cloud: {
      cloudName: '[dbyiupffc]',
      apiKey: '[276559622592629]',
      apiSecret: '[An3zkEUfvH4hmIZj2COgB4-dRI4]',
    },

    transformations: {
      effect: {
        name: 'pixelate',
        value: 40,
      },
    },
  });

  const myImage = cld.image('my-uploads');

  // Resize to 250 x 20 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(250).height(250));

  /**
   * handleOnChange
   * @description Triggers when the file input changes (ex: when a file is selected)
   */

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */

  async function handleOnSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === 'file',
    );
    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append('file', file);
    }
    formData.append('upload_preset', 'my-uploads');
    const data = await fetch(
      'https://api.cloudinary.com/v1_1/dbyiupffc/image/upload',
      {
        method: 'POST',
        body: formData,
      },
    ).then((r) => r.json());
    setImageSrc(data.secure_url);
    setUploadData(data);

    console.log('fileInput.files', fileInput.files);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Uploader</title>
        <meta name="description" content="Upload your image to Cloudinary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Image Uploader</h1>
        <p className={styles.description}>Upload your image to Cloudinary!</p>
        <form
          className={styles.form}
          method="post"
          onChange={handleOnChange}
          onSubmit={handleOnSubmit}
        >
          <p>
            <input type="file" name="file" />
          </p>

          <img src={imageSrc} />

          {imageSrc && !uploadData && (
            <p>
              <button>Upload Files</button>
            </p>
          )}

          {uploadData && (
            <code>
              <pre>{JSON.stringify(uploadData, null, 2)}</pre>
              <h3>Metadata: </h3>
              <p>{JSON.stringify(uploadData.width, null, 2)}</p>
              <p>{JSON.stringify(uploadData.height, null, 2)}</p>
              <p>{(uploadData.original_filename.replace(/"/g, ''), null, 2)}</p>
            </code>
          )}
        </form>
        {propertyNames.map((list) => (
          <li>
            {list}
            {propertyNames.map((item) => (
              <img key={item} src={item} />
            ))}
          </li>
        ))}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(
    'https://276559622592629:An3zkEUfvH4hmIZj2COgB4-dRI4@api.cloudinary.com/v1_1/dbyiupffc/resources/search',
  );
  const data = await res.json();
  var listUrl = function () {
    return data.resources.slice(0, 80).map(function (contact) {
      return contact.url;
    });
  };

  const data1 = JSON.parse(JSON.stringify(listUrl()));

  const dataFinal = Object.assign({}, data1);
  // console.log('newARRAY :', newArray); // [100, 200, 300]

  // Pass data to the page via props
  return { props: dataFinal };
}
