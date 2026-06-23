"use client";

import { useEffect, useRef } from "react";

const cretoHeaderHtml = "<section class=\"header-one\">\r\n      <div\r\n        class=\"header-outer-wrapper\"\r\n        style=\"\r\n          transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg)\r\n            rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);\r\n          transform-style: preserve-3d;\r\n        \"\r\n      >\r\n        <div class=\"main-container overflow-visible\">\r\n          <div class=\"header-one-main\">\r\n            <a href=\"/\" class=\"header-one-brand-logo w-inline-block\"\r\n              ><span class=\"lk-brand-lockup\"><img src=\"/leonkountouras-logo.png\" data-logo-base=\"/leonkountouras-logo.png\" data-logo-colored=\"/leonkountouras-logo-colored.png\" alt=\"Leon Kountouras logo\" class=\"lk-brand-logo-img lk-brand-logo-swap\" /><span class=\"lk-brand-text\">Λέων Κουντουράς</span></span></a>\r\n            <div class=\"home-one-header-block\">\r\n              <a\r\n                data-w-id=\"2b06b424-7a6a-6470-94df-778c4e388703\"\r\n                href=\"tel:(888)1234560\"\r\n                class=\"nav-call-button w-inline-block\"\r\n                ><div\r\n                  class=\"home-one-header-icon\"\r\n                  style=\"\r\n                    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1)\r\n                      rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);\r\n                    transform-style: preserve-3d;\r\n                  \"\r\n                >\r\n                  <img\r\n                    width=\"11\"\r\n                    height=\"11\"\r\n                    alt=\"Phone\"\r\n                    src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66b1b998225281e48b0dd1ec_Phone%20Icon.svg\"\r\n                    loading=\"lazy\"\r\n                  />\r\n                </div>\r\n                <div\r\n                  data-w-id=\"2b06b424-7a6a-6470-94df-778c4e388706\"\r\n                  class=\"header-one-bottom-line-text\"\r\n                >\r\n                  <div class=\"contact-text\">Let’s Talk</div>\r\n                  <div class=\"nav-button-white-line\">\r\n                    <div\r\n                      class=\"nav-button-black-line\"\r\n                      style=\"\r\n                        transform: translate3d(74.256px, 0px, 0px)\r\n                          scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                          rotateZ(0deg) skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                        will-change: transform;\r\n                      \"\r\n                    ></div>\r\n                  </div></div\r\n              ></a>\r\n              <div class=\"outline\"></div>\r\n              \r\n              <div\r\n                data-w-id=\"2b06b424-7a6a-6470-94df-778c4e388743\"\r\n                class=\"header-one-hamburger\"\r\n              >\r\n                <div class=\"nav-dot-div\">\r\n                  <div class=\"nav-dot-wrap\">\r\n                    <div\r\n                      class=\"nav-dot-one\"\r\n                      style=\"width: 3px; height: 3px\"\r\n                    ></div>\r\n                    <div class=\"nav-dot-two\" style=\"display: block\"></div>\r\n                  </div>\r\n                  <div class=\"nav-dot-wrap-two\">\r\n                    <div\r\n                      class=\"nav-dot-three\"\r\n                      style=\"width: 3px; height: 3px\"\r\n                    ></div>\r\n                    <div class=\"nav-dot-four\" style=\"display: block\"></div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div\r\n        class=\"header-mega-menu-outer-wrapper\"\r\n        style=\"width: 100%; height: 0vh\"\r\n      >\r\n        <div class=\"mega-menu-main\">\r\n          <div class=\"main-container\">\r\n            <div class=\"header-mega-menu\">\r\n              <div class=\"header-menu-bar-main\">\r\n                <div class=\"menu-list-block\">\r\n                  <div class=\"overflow-hidden\">\r\n                    <div\r\n                      data-delay=\"500\"\r\n                      data-hover=\"false\"\r\n                      data-w-id=\"2b06b424-7a6a-6470-94df-778c4e388752\"\r\n                      class=\"menu-list one w-dropdown\"\r\n                      style=\"\r\n                        transform: translate3d(0px, 100%, 0px) scale3d(1, 1, 1)\r\n                          rotateX(0deg) rotateY(0deg) rotateZ(0deg)\r\n                          skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                      \"\r\n                    >\r\n                      <div\r\n                        class=\"menu-list-main w-dropdown-toggle\"\r\n                        id=\"w-dropdown-toggle-0\"\r\n                        aria-controls=\"w-dropdown-list-0\"\r\n                        aria-haspopup=\"menu\"\r\n                        aria-expanded=\"false\"\r\n                        role=\"button\"\r\n                        tabindex=\"0\"\r\n                      >\r\n                        <div class=\"menu\">\r\n                          <div class=\"heading-three\">Home</div>\r\n                        </div>\r\n                        <div class=\"menu-sign\">\r\n                          <div class=\"menu-horizontal-line\"></div>\r\n                          <div\r\n                            class=\"menu-vertical-line\"\r\n                            style=\"\r\n                              transform: translate3d(0px, 0px, 0px)\r\n                                scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                                rotateZ(0deg) skew(0deg, 0deg);\r\n                              transform-style: preserve-3d;\r\n                            \"\r\n                          ></div>\r\n                        </div>\r\n                      </div>\r\n                      <nav\r\n                        class=\"dropdown-menu-list w-dropdown-list\"\r\n                        style=\"height: 0px\"\r\n                        id=\"w-dropdown-list-0\"\r\n                        aria-labelledby=\"w-dropdown-toggle-0\"\r\n                      >\r\n                        <div class=\"dropdown-menu-list-inner\">\r\n                          <a\r\n                            href=\"/home-one\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Home One</a\r\n                          ><a\r\n                            href=\"/home-two\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Home Two</a\r\n                          ><a\r\n                            href=\"/\"\r\n                            aria-current=\"page\"\r\n                            class=\"heading-six body-font-color w--current\"\r\n                            tabindex=\"0\"\r\n                            >Home Three</a\r\n                          >\r\n                        </div>\r\n                      </nav>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"overflow-hidden\">\r\n                    <div\r\n                      data-delay=\"500\"\r\n                      data-hover=\"false\"\r\n                      data-w-id=\"2b06b424-7a6a-6470-94df-778c4e388763\"\r\n                      class=\"menu-list two w-dropdown\"\r\n                      style=\"\r\n                        transform: translate3d(0px, 100%, 0px) scale3d(1, 1, 1)\r\n                          rotateX(0deg) rotateY(0deg) rotateZ(0deg)\r\n                          skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                      \"\r\n                    >\r\n                      <div\r\n                        class=\"menu-list-main w-dropdown-toggle\"\r\n                        id=\"w-dropdown-toggle-1\"\r\n                        aria-controls=\"w-dropdown-list-1\"\r\n                        aria-haspopup=\"menu\"\r\n                        aria-expanded=\"false\"\r\n                        role=\"button\"\r\n                        tabindex=\"0\"\r\n                      >\r\n                        <div class=\"menu\">\r\n                          <div class=\"heading-three\">About Us</div>\r\n                        </div>\r\n                        <div class=\"menu-sign\">\r\n                          <div class=\"menu-horizontal-line\"></div>\r\n                          <div\r\n                            class=\"menu-vertical-line\"\r\n                            style=\"\r\n                              transform: translate3d(0px, 0px, 0px)\r\n                                scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                                rotateZ(0deg) skew(0deg, 0deg);\r\n                              transform-style: preserve-3d;\r\n                            \"\r\n                          ></div>\r\n                        </div>\r\n                      </div>\r\n                      <nav\r\n                        class=\"dropdown-menu-list w-dropdown-list\"\r\n                        style=\"height: 0px\"\r\n                        id=\"w-dropdown-list-1\"\r\n                        aria-labelledby=\"w-dropdown-toggle-1\"\r\n                      >\r\n                        <div class=\"dropdown-menu-list-inner\">\r\n                          <a\r\n                            href=\"/about\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >About One</a\r\n                          ><a\r\n                            href=\"/about\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >About Two</a\r\n                          ><a\r\n                            href=\"/about\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >About Three</a\r\n                          >\r\n                        </div>\r\n                      </nav>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"overflow-hidden\">\r\n                    <div\r\n                      data-delay=\"500\"\r\n                      data-hover=\"false\"\r\n                      data-w-id=\"2b06b424-7a6a-6470-94df-778c4e388774\"\r\n                      class=\"menu-list three w-dropdown\"\r\n                      style=\"\r\n                        transform: translate3d(0px, 100%, 0px) scale3d(1, 1, 1)\r\n                          rotateX(0deg) rotateY(0deg) rotateZ(0deg)\r\n                          skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                      \"\r\n                    >\r\n                      <div\r\n                        class=\"menu-list-main w-dropdown-toggle\"\r\n                        id=\"w-dropdown-toggle-2\"\r\n                        aria-controls=\"w-dropdown-list-2\"\r\n                        aria-haspopup=\"menu\"\r\n                        aria-expanded=\"false\"\r\n                        role=\"button\"\r\n                        tabindex=\"0\"\r\n                      >\r\n                        <div class=\"menu\">\r\n                          <div class=\"heading-three\">Projects</div>\r\n                        </div>\r\n                        <div class=\"menu-sign\">\r\n                          <div class=\"menu-horizontal-line\"></div>\r\n                          <div\r\n                            class=\"menu-vertical-line\"\r\n                            style=\"\r\n                              transform: translate3d(0px, 0px, 0px)\r\n                                scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                                rotateZ(0deg) skew(0deg, 0deg);\r\n                              transform-style: preserve-3d;\r\n                            \"\r\n                          ></div>\r\n                        </div>\r\n                      </div>\r\n                      <nav\r\n                        class=\"dropdown-menu-list w-dropdown-list\"\r\n                        style=\"height: 0px\"\r\n                        id=\"w-dropdown-list-2\"\r\n                        aria-labelledby=\"w-dropdown-toggle-2\"\r\n                      >\r\n                        <div class=\"dropdown-menu-list-inner\">\r\n                          <a\r\n                            href=\"/service-one\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Service One</a\r\n                          ><a\r\n                            href=\"/service-two\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Service Two</a\r\n                          ><a\r\n                            href=\"#works\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Service Three</a\r\n                          >\r\n                        </div>\r\n                      </nav>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"overflow-hidden\">\r\n                    <div\r\n                      data-delay=\"500\"\r\n                      data-hover=\"false\"\r\n                      data-w-id=\"2b06b424-7a6a-6470-94df-778c4e388785\"\r\n                      class=\"menu-list four w-dropdown\"\r\n                      style=\"\r\n                        transform: translate3d(0px, 100%, 0px) scale3d(1, 1, 1)\r\n                          rotateX(0deg) rotateY(0deg) rotateZ(0deg)\r\n                          skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                      \"\r\n                    >\r\n                      <div\r\n                        class=\"menu-list-main w-dropdown-toggle\"\r\n                        id=\"w-dropdown-toggle-3\"\r\n                        aria-controls=\"w-dropdown-list-3\"\r\n                        aria-haspopup=\"menu\"\r\n                        aria-expanded=\"false\"\r\n                        role=\"button\"\r\n                        tabindex=\"0\"\r\n                      >\r\n                        <div class=\"menu\">\r\n                          <div class=\"heading-three\">Services</div>\r\n                        </div>\r\n                        <div class=\"menu-sign\">\r\n                          <div class=\"menu-horizontal-line\"></div>\r\n                          <div\r\n                            class=\"menu-vertical-line\"\r\n                            style=\"\r\n                              transform: translate3d(0px, 0px, 0px)\r\n                                scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                                rotateZ(0deg) skew(0deg, 0deg);\r\n                              transform-style: preserve-3d;\r\n                            \"\r\n                          ></div>\r\n                        </div>\r\n                      </div>\r\n                      <nav\r\n                        class=\"dropdown-menu-list w-dropdown-list\"\r\n                        style=\"height: 0px\"\r\n                        id=\"w-dropdown-list-3\"\r\n                        aria-labelledby=\"w-dropdown-toggle-3\"\r\n                      >\r\n                        <div class=\"dropdown-menu-list-inner\">\r\n                          <a\r\n                            href=\"/pricing-one\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Pricing One</a\r\n                          ><a\r\n                            href=\"/pricing-two\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Pricing Two</a\r\n                          ><a\r\n                            href=\"/our-team\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Our Team</a\r\n                          ><a\r\n                            href=\"/career\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Career</a\r\n                          ><a\r\n                            href=\"/request-a-demo\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Request A Demo</a\r\n                          ><a\r\n                            href=\"/knowledge-base\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Knowledge Base</a\r\n                          >\r\n                        </div>\r\n                      </nav>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"overflow-hidden\">\r\n                    <div\r\n                      data-delay=\"500\"\r\n                      data-hover=\"false\"\r\n                      data-w-id=\"2b06b424-7a6a-6470-94df-778c4e38879c\"\r\n                      class=\"menu-list five w-dropdown\"\r\n                      style=\"\r\n                        transform: translate3d(0px, 100%, 0px) scale3d(1, 1, 1)\r\n                          rotateX(0deg) rotateY(0deg) rotateZ(0deg)\r\n                          skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                      \"\r\n                    >\r\n                      <div\r\n                        class=\"menu-list-main w-dropdown-toggle\"\r\n                        id=\"w-dropdown-toggle-4\"\r\n                        aria-controls=\"w-dropdown-list-4\"\r\n                        aria-haspopup=\"menu\"\r\n                        aria-expanded=\"false\"\r\n                        role=\"button\"\r\n                        tabindex=\"0\"\r\n                      >\r\n                        <div class=\"menu\">\r\n                          <div class=\"heading-three\">Portfolio</div>\r\n                        </div>\r\n                        <div class=\"menu-sign\">\r\n                          <div class=\"menu-horizontal-line\"></div>\r\n                          <div\r\n                            class=\"menu-vertical-line\"\r\n                            style=\"\r\n                              transform: translate3d(0px, 0px, 0px)\r\n                                scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                                rotateZ(0deg) skew(0deg, 0deg);\r\n                              transform-style: preserve-3d;\r\n                            \"\r\n                          ></div>\r\n                        </div>\r\n                      </div>\r\n                      <nav\r\n                        class=\"dropdown-menu-list w-dropdown-list\"\r\n                        style=\"height: 0px\"\r\n                        id=\"w-dropdown-list-4\"\r\n                        aria-labelledby=\"w-dropdown-toggle-4\"\r\n                      >\r\n                        <div class=\"dropdown-menu-list-inner\">\r\n                          <a\r\n                            href=\"/projects/hotels-finder\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Portfolio One</a\r\n                          ><a\r\n                            href=\"/projects/next-js-finance-app\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Portfolio Two</a\r\n                          >\r\n                        </div>\r\n                      </nav>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"overflow-hidden\">\r\n                    <div\r\n                      data-delay=\"500\"\r\n                      data-hover=\"false\"\r\n                      data-w-id=\"2b06b424-7a6a-6470-94df-778c4e3887ab\"\r\n                      class=\"menu-list six w-dropdown\"\r\n                      style=\"\r\n                        transform: translate3d(0px, 100%, 0px) scale3d(1, 1, 1)\r\n                          rotateX(0deg) rotateY(0deg) rotateZ(0deg)\r\n                          skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                      \"\r\n                    >\r\n                      <div\r\n                        class=\"menu-list-main w-dropdown-toggle\"\r\n                        id=\"w-dropdown-toggle-5\"\r\n                        aria-controls=\"w-dropdown-list-5\"\r\n                        aria-haspopup=\"menu\"\r\n                        aria-expanded=\"false\"\r\n                        role=\"button\"\r\n                        tabindex=\"0\"\r\n                      >\r\n                        <div class=\"menu\">\r\n                          <div class=\"heading-three\">Blog</div>\r\n                        </div>\r\n                        <div class=\"menu-sign\">\r\n                          <div class=\"menu-horizontal-line\"></div>\r\n                          <div\r\n                            class=\"menu-vertical-line\"\r\n                            style=\"\r\n                              transform: translate3d(0px, 0px, 0px)\r\n                                scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                                rotateZ(0deg) skew(0deg, 0deg);\r\n                              transform-style: preserve-3d;\r\n                            \"\r\n                          ></div>\r\n                        </div>\r\n                      </div>\r\n                      <nav\r\n                        class=\"dropdown-menu-list w-dropdown-list\"\r\n                        style=\"height: 0px\"\r\n                        id=\"w-dropdown-list-5\"\r\n                        aria-labelledby=\"w-dropdown-toggle-5\"\r\n                      >\r\n                        <div class=\"dropdown-menu-list-inner\">\r\n                          <a\r\n                            href=\"#blog\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Blog One</a\r\n                          ><a\r\n                            href=\"#blog\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Blog Two</a\r\n                          ><a\r\n                            href=\"#blog\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Blog Three</a\r\n                          >\r\n                        </div>\r\n                      </nav>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"overflow-hidden\">\r\n                    <div\r\n                      data-delay=\"500\"\r\n                      data-hover=\"false\"\r\n                      data-w-id=\"2b06b424-7a6a-6470-94df-778c4e3887bc\"\r\n                      class=\"menu-list seven w-dropdown\"\r\n                      style=\"\r\n                        transform: translate3d(0px, 100%, 0px) scale3d(1, 1, 1)\r\n                          rotateX(0deg) rotateY(0deg) rotateZ(0deg)\r\n                          skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                      \"\r\n                    >\r\n                      <div\r\n                        class=\"menu-list-main w-dropdown-toggle\"\r\n                        id=\"w-dropdown-toggle-6\"\r\n                        aria-controls=\"w-dropdown-list-6\"\r\n                        aria-haspopup=\"menu\"\r\n                        aria-expanded=\"false\"\r\n                        role=\"button\"\r\n                        tabindex=\"0\"\r\n                      >\r\n                        <div class=\"menu\">\r\n                          <div class=\"heading-three\">E-Commerce</div>\r\n                        </div>\r\n                        <div class=\"menu-sign\">\r\n                          <div class=\"menu-horizontal-line\"></div>\r\n                          <div\r\n                            class=\"menu-vertical-line\"\r\n                            style=\"\r\n                              transform: translate3d(0px, 0px, 0px)\r\n                                scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                                rotateZ(0deg) skew(0deg, 0deg);\r\n                              transform-style: preserve-3d;\r\n                            \"\r\n                          ></div>\r\n                        </div>\r\n                      </div>\r\n                      <nav\r\n                        class=\"dropdown-menu-list w-dropdown-list\"\r\n                        style=\"height: 0px\"\r\n                        id=\"w-dropdown-list-6\"\r\n                        aria-labelledby=\"w-dropdown-toggle-6\"\r\n                      >\r\n                        <div class=\"dropdown-menu-list-inner\">\r\n                          <a\r\n                            href=\"/shop\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Shop</a\r\n                          ><a\r\n                            href=\"https://creto.webflow.io/product/branding-container\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Shop Details</a\r\n                          ><a\r\n                            href=\"https://creto.webflow.io/checkout\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Checkout</a\r\n                          ><a\r\n                            href=\"https://creto.webflow.io/paypal-checkout\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Paypal Checkout</a\r\n                          ><a\r\n                            href=\"https://creto.webflow.io/order-confirmation\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Order Confirmation</a\r\n                          >\r\n                        </div>\r\n                      </nav>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"overflow-hidden\">\r\n                    <div\r\n                      data-delay=\"500\"\r\n                      data-hover=\"false\"\r\n                      data-w-id=\"2b06b424-7a6a-6470-94df-778c4e3887d1\"\r\n                      class=\"menu-list eight w-dropdown\"\r\n                      style=\"\r\n                        transform: translate3d(0px, 100%, 0px) scale3d(1, 1, 1)\r\n                          rotateX(0deg) rotateY(0deg) rotateZ(0deg)\r\n                          skew(0deg, 0deg);\r\n                        transform-style: preserve-3d;\r\n                      \"\r\n                    >\r\n                      <div\r\n                        class=\"menu-list-main w-dropdown-toggle\"\r\n                        id=\"w-dropdown-toggle-7\"\r\n                        aria-controls=\"w-dropdown-list-7\"\r\n                        aria-haspopup=\"menu\"\r\n                        aria-expanded=\"false\"\r\n                        role=\"button\"\r\n                        tabindex=\"0\"\r\n                      >\r\n                        <div class=\"menu\">\r\n                          <div class=\"heading-three\">Contact</div>\r\n                        </div>\r\n                        <div class=\"menu-sign\">\r\n                          <div class=\"menu-horizontal-line\"></div>\r\n                          <div\r\n                            class=\"menu-vertical-line\"\r\n                            style=\"\r\n                              transform: translate3d(0px, 0px, 0px)\r\n                                scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                                rotateZ(0deg) skew(0deg, 0deg);\r\n                              transform-style: preserve-3d;\r\n                            \"\r\n                          ></div>\r\n                        </div>\r\n                      </div>\r\n                      <nav\r\n                        class=\"dropdown-menu-list w-dropdown-list\"\r\n                        style=\"height: 0px\"\r\n                        id=\"w-dropdown-list-7\"\r\n                        aria-labelledby=\"w-dropdown-toggle-7\"\r\n                      >\r\n                        <div class=\"dropdown-menu-list-inner\">\r\n                          <a\r\n                            href=\"/contact-one\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Contact One</a\r\n                          ><a\r\n                            href=\"/contact-two\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Contact Two</a\r\n                          ><a\r\n                            href=\"mailto:koundouras@gmail.com\"\r\n                            class=\"heading-six body-font-color\"\r\n                            tabindex=\"0\"\r\n                            >Contact Three</a\r\n                          >\r\n                        </div>\r\n                      </nav>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n                <div class=\"menu-social-block\">\r\n                  <div class=\"menu-get-in-touch\">\r\n                    <div class=\"overflow-hidden\">\r\n                      <div\r\n                        class=\"menu-get-in-touch-heading one\"\r\n                        style=\"\r\n                          transform: translate3d(0px, 100%, 0px)\r\n                            scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                            rotateZ(0deg) skew(0deg, 0deg);\r\n                          transform-style: preserve-3d;\r\n                        \"\r\n                      >\r\n                        <div class=\"heading-three\">Get In Touch</div>\r\n                        <img\r\n                          loading=\"lazy\"\r\n                          height=\"20\"\r\n                          alt=\"White Arrow\"\r\n                          src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66b1b990225281e48b0dccc4_White%20Arrow.svg\"\r\n                        />\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"menu-get-in-touch-contact\">\r\n                      <div class=\"overflow-hidden\">\r\n                        <div\r\n                          class=\"menu-get-in-touch-contact-card one\"\r\n                          style=\"\r\n                            transform: translate3d(0px, 100%, 0px)\r\n                              scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                              rotateZ(0deg) skew(0deg, 0deg);\r\n                            transform-style: preserve-3d;\r\n                          \"\r\n                        >\r\n                          <div class=\"menu-get-in-touch-card-icon\">\r\n                            <img\r\n                              loading=\"lazy\"\r\n                              height=\"28\"\r\n                              alt=\"Icon\"\r\n                              src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66c479e348163bd6ac42215b_Phone.svg\"\r\n                            />\r\n                          </div>\r\n                          <div class=\"menu-get-in-touch-contact-card-text\">\r\n                            <div>Call Us</div>\r\n                            <a href=\"tel:\" class=\"heading-five\"\r\n                              >Κατόπιν επικοινωνίας μέσω email</a\r\n                            >\r\n                          </div>\r\n                        </div>\r\n                      </div>\r\n                      <div class=\"overflow-hidden\">\r\n                        <div\r\n                          class=\"menu-get-in-touch-contact-card two\"\r\n                          style=\"\r\n                            transform: translate3d(0px, 100%, 0px)\r\n                              scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                              rotateZ(0deg) skew(0deg, 0deg);\r\n                            transform-style: preserve-3d;\r\n                          \"\r\n                        >\r\n                          <div class=\"menu-get-in-touch-card-icon\">\r\n                            <img\r\n                              loading=\"lazy\"\r\n                              height=\"19\"\r\n                              alt=\"Icon\"\r\n                              src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66c479e348163bd6ac4221be_Mail.svg\"\r\n                            />\r\n                          </div>\r\n                          <div class=\"menu-get-in-touch-contact-card-text\">\r\n                            <div>Email Us</div>\r\n                            <a\r\n                              href=\"mailto:koundouras@gmail.com\"\r\n                              class=\"heading-five font-small\"\r\n                              >koundouras@gmail.com</a\r\n                            >\r\n                          </div>\r\n                        </div>\r\n                      </div>\r\n                      <div class=\"overflow-hidden\">\r\n                        <div\r\n                          class=\"menu-get-in-touch-contact-card three\"\r\n                          style=\"\r\n                            transform: translate3d(0px, 100%, 0px)\r\n                              scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                              rotateZ(0deg) skew(0deg, 0deg);\r\n                            transform-style: preserve-3d;\r\n                          \"\r\n                        >\r\n                          <div class=\"menu-get-in-touch-card-icon\">\r\n                            <img\r\n                              loading=\"lazy\"\r\n                              height=\"28\"\r\n                              alt=\"Icon\"\r\n                              src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66c479e348163bd6ac42218e_Location.svg\"\r\n                            />\r\n                          </div>\r\n                          <div class=\"menu-get-in-touch-contact-card-text\">\r\n                            <div>Location</div>\r\n                            <div\r\n                              class=\"menu-get-in-touch-contact-card-text-location\"\r\n                            >\r\n                              <div class=\"heading-five\">\r\n                                Greece \r\n                              </div>\r\n                            </div>\r\n                          </div>\r\n                        </div>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                  <div class=\"menu-social-link-block\">\r\n                    <div class=\"overflow-hidden\">\r\n                      <div\r\n                        class=\"menu-get-in-touch-heading two\"\r\n                        style=\"\r\n                          transform: translate3d(0px, 100%, 0px)\r\n                            scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                            rotateZ(0deg) skew(0deg, 0deg);\r\n                          transform-style: preserve-3d;\r\n                        \"\r\n                      >\r\n                        <div class=\"heading-three\">LinkedIn</div>\r\n                        <img\r\n                          loading=\"lazy\"\r\n                          height=\"20\"\r\n                          alt=\"White Arrow\"\r\n                          src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66b1b990225281e48b0dccc4_White%20Arrow.svg\"\r\n                        />\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"overflow-hidden\">\r\n                      <div\r\n                        class=\"menu-social-link-item\"\r\n                        style=\"\r\n                          transform: translate3d(0px, 100%, 0px)\r\n                            scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)\r\n                            rotateZ(0deg) skew(0deg, 0deg);\r\n                          transform-style: preserve-3d;\r\n                        \"\r\n                      >\r\n                        <a\r\n                          href=\"https://www.linkedin.com/in/leon-koundouras/\"\r\n                          target=\"_blank\"\r\n                          class=\"menu-social-link-card w-inline-block\"\r\n                          ><img\r\n                            loading=\"lazy\"\r\n                            height=\"16\"\r\n                            alt=\"Icon\"\r\n                            src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66c479e448163bd6ac4221f0_LinkedIn.svg\"\r\n                          />\r\n                          <div class=\"font-color-white\">LinkedIn</div></a\r\n                        ><a\r\n                          href=\"https://in.pinterest.com/\"\r\n                          target=\"_blank\"\r\n                          class=\"menu-social-link-card w-inline-block\"\r\n                          ><img\r\n                            loading=\"lazy\"\r\n                            height=\"16\"\r\n                            alt=\"Icon\"\r\n                            src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66c479e348163bd6ac4221e4_Pinterest.svg\"\r\n                          />\r\n                          <div class=\"font-color-white\">Pinterest</div></a\r\n                        ><a\r\n                          href=\"https://www.linkedin.com/in/leon-koundouras/\"\r\n                          target=\"_blank\"\r\n                          class=\"menu-social-link-card w-inline-block\"\r\n                          ><img\r\n                            loading=\"lazy\"\r\n                            height=\"16\"\r\n                            alt=\"Icon\r\n\"\r\n                            src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66c479e448163bd6ac422218_Linkedin.svg\"\r\n                          />\r\n                          <div class=\"font-color-white\">Linked In</div></a\r\n                        ><a\r\n                          href=\"https://www.facebook.com/\"\r\n                          target=\"_blank\"\r\n                          class=\"menu-social-link-card w-inline-block\"\r\n                          ><img\r\n                            loading=\"lazy\"\r\n                            height=\"16\"\r\n                            alt=\"Icon\"\r\n                            src=\"https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/66c479e348163bd6ac4221cc_Facebook.svg\"\r\n                          />\r\n                          <div class=\"font-color-white\">Facebook</div></a\r\n                        >\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"menu-background-text-marque\">\r\n          <div class=\"marque\">\r\n            <div class=\"marque-main\">\r\n              <div\r\n                class=\"marque-train\"\r\n                style=\"\r\n                  transform: translate3d(-1.25%, 0px, 0px) scale3d(1, 1, 1)\r\n                    rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);\r\n                  transform-style: preserve-3d;\r\n                  will-change: transform;\r\n                \"\r\n              >\r\n                <div class=\"header-menu-bar-background-text\">Leon</div>\r\n              </div>\r\n              <div\r\n                class=\"marque-train\"\r\n                style=\"\r\n                  transform: translate3d(-1.25%, 0px, 0px) scale3d(1, 1, 1)\r\n                    rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);\r\n                  transform-style: preserve-3d;\r\n                  will-change: transform;\r\n                \"\r\n              >\r\n                <div class=\"header-menu-bar-background-text\">Leon</div>\r\n              </div>\r\n              <div\r\n                class=\"marque-train\"\r\n                style=\"\r\n                  transform: translate3d(-1.25%, 0px, 0px) scale3d(1, 1, 1)\r\n                    rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);\r\n                  transform-style: preserve-3d;\r\n                  will-change: transform;\r\n                \"\r\n              >\r\n                <div class=\"header-menu-bar-background-text\">Leon</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"menu-center-line\"></div>\r\n        <div class=\"menu-background-radial\"></div>\r\n      </div>\r\n    </section>";
const cretoCssHref = "https://cdn.prod.website-files.com/6620a2675e3acea2378415a0/css/creto.webflow.shared.dde3cdb98.css";

const desktopSkillsHtml = [
  "React.js",
  "Next.js",
  "Node.js",
  "SEO & Performance",
]
  .map(
    (skill) =>
      '<span class="creto-desktop-skill lk-glass-button-wrap">' +
      '<button type="button" class="lk-glass-button" tabindex="-1" aria-hidden="true">' +
      "<span>" +
      skill +
      "</span>" +
      "</button>" +
      '<span class="lk-glass-button-shadow"></span>' +
      "</span>",
  )
  .join("");

function setTranslateY(element: HTMLElement, value: string) {
  element.style.transform =
    "translate3d(0px, " +
    value +
    ", 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)";
  element.style.transformStyle = "preserve-3d";
}

function openMenu(root: HTMLElement) {
  const menu = root.querySelector<HTMLElement>(".header-mega-menu-outer-wrapper");
  const header = root.querySelector<HTMLElement>(".header-outer-wrapper");

  if (!menu) return;

  document.documentElement.classList.add("creto-menu-open");
  root.dataset.open = "true";
  delete root.dataset.closing;

  if (header) {
    header.style.zIndex = "1000002";
  }

  menu.style.display = "block";
  menu.style.width = "100%";
  menu.style.height = "0vh";
  menu.style.overflow = "hidden";
  menu.style.pointerEvents = "auto";
  menu.style.transition = "height 0.95s cubic-bezier(0.83, 0, 0.17, 1)";

  window.requestAnimationFrame(() => {
    menu.style.height = "100vh";
  });

  const slideItems = root.querySelectorAll<HTMLElement>(
    [
      ".menu-list",
      ".menu-get-in-touch-heading",
      ".menu-get-in-touch-contact-card",
      ".menu-social-links-heading",
      ".menu-social-link",
      ".menu-social-link-item",
      ".menu-social-link-card",
      ".menu-creto-text",
      ".marque-slow-train",
      ".menu-background-text-marque",
      ".header-menu-bar-background-text",
    ].join(", ")
  );

  slideItems.forEach((item, index) => {
    item.style.transition =
      "transform 0.82s cubic-bezier(0.22, 1, 0.36, 1)";
    item.style.transitionDelay = 0.32 + index * 0.045 + "s";
    setTranslateY(item, "110%");
  });

  window.requestAnimationFrame(() => {
    slideItems.forEach((item) => {
      setTranslateY(item, "0%");
    });
  });
}

function closeMenu(root: HTMLElement) {
  const menu = root.querySelector<HTMLElement>(".header-mega-menu-outer-wrapper");

  if (!menu) return;

  root.dataset.closing = "true";

  const slideItems = root.querySelectorAll<HTMLElement>(
    [
      ".menu-list",
      ".menu-get-in-touch-heading",
      ".menu-get-in-touch-contact-card",
      ".menu-social-links-heading",
      ".menu-social-link",
      ".menu-social-link-item",
      ".menu-social-link-card",
      ".menu-creto-text",
      ".marque-slow-train",
      ".menu-background-text-marque",
      ".header-menu-bar-background-text",
    ].join(", ")
  );

  slideItems.forEach((item, index) => {
    item.style.transition =
      "transform 0.55s cubic-bezier(0.83, 0, 0.17, 1)";
    item.style.transitionDelay = index * 0.02 + "s";
    setTranslateY(item, "110%");
  });

  menu.style.transition =
    "height 0.72s cubic-bezier(0.83, 0, 0.17, 1) 0.18s";
  menu.style.height = "0vh";

  window.setTimeout(() => {
    if (root.dataset.open === "true" && root.dataset.closing !== "true") return;

    document.documentElement.classList.remove("creto-menu-open");
    root.dataset.open = "false";
    restartNavButtonLine(root);
    delete root.dataset.closing;

    menu.style.pointerEvents = "none";
  }, 920);
}

function setupDropdowns(root: HTMLElement) {
  const setImportant = (
    element: HTMLElement,
    property: string,
    value: string,
  ) => {
    element.style.setProperty(property, value, "important");
  };

  const openProjectsModal = () => {
    const modal = root.querySelector<HTMLElement>(".leon-menu-projects-modal");
    const projectList = root.querySelector<HTMLElement>(
      ".menu-list[data-leon-menu-item='projects']",
    );
    const verticalLine = projectList?.querySelector<HTMLElement>(
      ".menu-vertical-line",
    );

    if (!modal) return;

    modal.dataset.open = "true";
    setImportant(modal, "opacity", "1");
    setImportant(modal, "pointer-events", "auto");
    setImportant(modal, "transform", "translate3d(0px, 0px, 0px) scale(1)");

    if (verticalLine) {
      verticalLine.style.transform =
        "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(90deg) skew(0deg, 0deg)";
    }
  };

  const closeProjectsModal = () => {
    const modal = root.querySelector<HTMLElement>(".leon-menu-projects-modal");
    const projectList = root.querySelector<HTMLElement>(
      ".menu-list[data-leon-menu-item='projects']",
    );
    const verticalLine = projectList?.querySelector<HTMLElement>(
      ".menu-vertical-line",
    );

    if (!modal) return;

    modal.dataset.open = "false";
    setImportant(modal, "opacity", "0");
    setImportant(modal, "pointer-events", "none");
    setImportant(modal, "transform", "translate3d(0px, 18px, 0px) scale(0.96)");

    if (verticalLine) {
      verticalLine.style.transform =
        "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)";
    }
  };

  root.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;

      if (!target) return;

      const projectsTrigger =
        target.closest<HTMLElement>("[data-projects-trigger='true']") ??
        target.closest<HTMLElement>(".menu-list[data-leon-menu-item='projects']");

      if (!projectsTrigger) return;

      if (target.closest(".leon-menu-projects-modal")) return;

      event.preventDefault();
      event.stopPropagation();

      const modal = root.querySelector<HTMLElement>(".leon-menu-projects-modal");
      const isOpen = modal?.dataset.open === "true";

      if (isOpen) {
        closeProjectsModal();
      } else {
        openProjectsModal();
      }
    },
    true,
  );

  root
    .querySelectorAll<HTMLElement>(
      ".leon-menu-projects-modal-close, .leon-menu-projects-modal-backdrop",
    )
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeProjectsModal();
      });
    });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProjectsModal();
    }
  });
}

function syncCretoMenuContent(root: HTMLElement) {
  const projectItems = [
    ["Hotels Finder", "/projects/hotels-finder"],
    ["Hotels Finder Room Page", "/projects/hotels-finder-room-page"],
    ["Next.js Finance App", "/projects/next-js-finance-app"],
    ["Personal Portfolio", "/projects/personal-portfolio"],
    ["Phidiashouse Apartments", "/projects/phidiashouse-apartments"],
    ["Exsell Digital Marketplace", "/projects/exsell-digital-marketplace"],
    ["Psyllias Giorgos Gypsosanides", "/projects/psyllias-giorgos-gypsosanides"],
    ["Osiris Contact Learning", "/projects/osiris-contact-learning"],
    ["Hotels Finder ElementFX", "/projects/hotels-finder-elementfx"],
    ["MenuHelp App", "/projects/menuhelp-app"],
    ["Bookaholics", "/projects/bookaholics"],
    ["create-website.gr", "/projects/create-website-gr"],
    ["Argynet Support Hosting", "/projects/argynet-support-hosting"],
    ["Body Move", "/projects/body-move"],
    ["Tesma", "/projects/tesma"],
    ["Zafiropoulos Tours", "/projects/zafiropoulos-tours"],
    ["Mykonos Rent A Cars", "/projects/mykonos-rent-a-cars"],
  ];

  const desiredMainItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "about", label: "About", href: "/about" },
    { key: "projects", label: "Projects", href: "#works" },
    { key: "blog", label: "Blog", href: "#blog" },
    { key: "contact", label: "Contact", href: "mailto:koundouras@gmail.com" },
  ];

  const menuLists = Array.from(root.querySelectorAll<HTMLElement>(".menu-list"));

  const setMenuLabel = (item: HTMLElement, labelText: string) => {
    const main = item.querySelector<HTMLElement>(".menu-list-main");
    if (!main) return;

    const labels = Array.from(
      main.querySelectorAll<HTMLElement>("a div, a span, div, span"),
    ).filter((element) => {
      const className = String(element.className || "");
      const text = element.textContent?.trim() ?? "";

      if (!text) return false;
      if (className.includes("menu-horizontal-line")) return false;
      if (className.includes("menu-vertical-line")) return false;
      if (className.includes("line")) return false;
      if (element.querySelector(".menu-horizontal-line")) return false;
      if (element.querySelector(".menu-vertical-line")) return false;

      return element.children.length === 0;
    });

    const label = labels[0];

    if (label) {
      label.textContent = labelText;
    }
  };

  menuLists.forEach((item, index) => {
    const desired = desiredMainItems[index];

    if (!desired) {
      item.style.display = "none";
      return;
    }

    item.style.display = "";
    item.dataset.leonMenuItem = desired.key;

    const mainLink =
      item.querySelector<HTMLAnchorElement>(".menu-list-main a[href]") ??
      item.querySelector<HTMLAnchorElement>("a[href]");

    if (mainLink) {
      if (desired.key === "projects") {
        mainLink.setAttribute("href", "#projects-modal");
        mainLink.setAttribute("data-projects-trigger", "true");
      } else {
        mainLink.setAttribute("href", desired.href);
        mainLink.removeAttribute("data-projects-trigger");
      }
    }

    setMenuLabel(item, desired.label);

    /*
      Κρατάμε τους original σταυρούς δεξιά.
      Δεν κρύβουμε horizontal/vertical lines.
    */
    const horizontalLine = item.querySelector<HTMLElement>(".menu-horizontal-line");
    const verticalLine = item.querySelector<HTMLElement>(".menu-vertical-line");

    if (horizontalLine) horizontalLine.style.display = "";
    if (verticalLine) verticalLine.style.display = "";

    const oldDropdown = item.querySelector<HTMLElement>(".dropdown-menu-list");

    if (oldDropdown) {
      oldDropdown.remove();
    }
  });

  root.querySelectorAll<HTMLAnchorElement>(
    ".nav-call-button, .nav-call-button a, a[href^='tel:']",
  ).forEach((link) => {
    link.setAttribute("href", "tel:");
  });

  let modal = root.querySelector<HTMLElement>(".leon-menu-projects-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.className = "leon-menu-projects-modal";
    modal.dataset.open = "false";

    modal.innerHTML =
      '<div class="leon-menu-projects-modal-backdrop"></div>' +
      '<div class="leon-menu-projects-modal-panel" role="dialog" aria-modal="true" aria-label="Projects">' +
      '<button type="button" class="leon-menu-projects-modal-close" aria-label="Close projects">×</button>' +
      '<div class="leon-menu-projects-modal-kicker">Selected works</div>' +
      '<h2 class="leon-menu-projects-modal-title">Projects</h2>' +
      '<div class="leon-menu-projects-modal-grid"></div>' +
      '</div>';

    root.appendChild(modal);
  }

  const grid = modal.querySelector<HTMLElement>(".leon-menu-projects-modal-grid");

  if (grid) {
    grid.innerHTML = "";

    projectItems.forEach(([title, href], index) => {
      const link = document.createElement("a");
      link.href = href;
      link.className = "leon-menu-projects-modal-link";
      link.setAttribute("data-project-menu-link", "true");

      const number = document.createElement("span");
      number.className = "leon-menu-projects-modal-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const text = document.createElement("span");
      text.className = "leon-menu-projects-modal-text";
      text.textContent = title;

      link.appendChild(number);
      link.appendChild(text);
      grid.appendChild(link);
    });
  }

const socialItems = root.querySelectorAll<HTMLElement>(".menu-social-link-item");

socialItems.forEach((item) => {
  item.style.display = "flex";
  item.style.opacity = "1";
  item.style.visibility = "visible";
  item.style.transform =
    "translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)";
  item.style.transformStyle = "preserve-3d";

item.innerHTML =
  '<a href="https://www.linkedin.com/in/leon-koundouras/" target="_blank" rel="noopener noreferrer" class="menu-social-link-card lk-linkedin-social-card w-inline-block" aria-label="LinkedIn">' +
  '<svg class="lk-linkedin-social-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
  '<path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.84v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.86c0-1.87-.03-4.28-2.61-4.28-2.61 0-3.01 2.04-3.01 4.15V23h-4V8z"/>' +
  '</svg>' +
  '<div class="font-color-white">LinkedIn</div>' +
  '</a>';
});

}

function setupInternalLinks(root: HTMLElement) {
  const links = root.querySelectorAll<HTMLAnchorElement>("a[href]");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (link.dataset.projectsTrigger === "true") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (!href || href === "#") return;

      if (href.startsWith("mailto:") || href.startsWith("https://")) {
        closeMenu(root);
        return;
      }

      if (href.startsWith("#")) {
        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();
        closeMenu(root);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (href.startsWith("/projects/")) {
        const parts = href.split("/").filter(Boolean);
        const slug = parts[parts.length - 1];

        if (!slug) return;

        const projectLink = document.querySelector<HTMLAnchorElement>(
          '[data-project-slug="' + slug + '"]',
        );

        if (projectLink) {
          event.preventDefault();
          closeMenu(root);

          window.setTimeout(() => {
            projectLink.click();
          }, 180);

          return;
        }
      }

      event.preventDefault();
      closeMenu(root);
      window.location.href = href;
    });
  });
}

function setupAboutMenuRoute(shadowRoot: ShadowRoot) {
  const aboutItems = Array.from(
    shadowRoot.querySelectorAll<HTMLElement>('[data-leon-menu-item="about"]'),
  );

  const handleAboutClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    window.location.href = "/about";
  };

  aboutItems.forEach((item) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", handleAboutClick);
  });

  return () => {
    aboutItems.forEach((item) => {
      item.removeEventListener("click", handleAboutClick);
    });
  };
}

function restartNavButtonLine(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".nav-button-black-line").forEach((line) => {
    line.style.removeProperty("transform");
    line.style.removeProperty("will-change");
    line.style.animationName = "lkNavButtonLineAuto";
    line.style.animationDuration = "1.65s";
    line.style.animationTimingFunction = "cubic-bezier(0.76, 0, 0.24, 1)";
    line.style.animationIterationCount = "infinite";
    line.style.animationFillMode = "both";
  });
}

function splitBrandLogo(root: HTMLElement) {
  const brand = root.querySelector<HTMLElement>(".lk-brand-text");

  if (!brand) return;
  if (brand.dataset.split === "true") return;

  const text = brand.textContent ?? "";

  brand.dataset.split = "true";
  brand.setAttribute("aria-label", text);
  brand.textContent = "";

  Array.from(text).forEach((char, index) => {
    if (char === " ") {
      const space = document.createElement("span");
      space.className = "lk-brand-space";
      space.textContent = " ";
      brand.appendChild(space);
      return;
    }

    const mask = document.createElement("span");
    mask.className = "lk-brand-letter-mask";
    mask.setAttribute("aria-hidden", "true");

    const letter = document.createElement("span");
    letter.className = "lk-brand-letter";
    letter.textContent = char;
    letter.style.animationDelay = index * 0.045 + "s";

    mask.appendChild(letter);
    brand.appendChild(mask);
  });
}

function replayBrandLogo(root: HTMLElement) {
  splitBrandLogo(root);

  const letters = root.querySelectorAll<HTMLElement>(".lk-brand-letter");

  letters.forEach((letter, index) => {
    letter.style.animation = "none";
    letter.style.opacity = "0";
    letter.style.transform = "translate3d(0, 115%, 0) rotate(7deg)";
    letter.offsetHeight;

    letter.style.animationName = "lkBrandLetterReveal";
    letter.style.animationDuration = "0.72s";
    letter.style.animationTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
    letter.style.animationFillMode = "both";
    letter.style.animationDelay = index * 0.045 + "s";
  });
}

export default function CretoMenu() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    const isDesktop = window.matchMedia("(min-width: 992px)").matches;

    if (!isDesktop) {
      const host = hostRef.current;
      host?.shadowRoot?.replaceChildren();
      return;
    }

    const host = hostRef.current;

    if (!host) return;

    const shadow =
      host.shadowRoot ?? host.attachShadow({ mode: "open" });

    shadow.innerHTML =
      '<link rel="stylesheet" href="' +
      cretoCssHref +
      '" crossorigin="anonymous" />' +
      '<style>' +
      ':host {' +
      'all: initial;' +
      '--background-color: transparent;' +
      '--body-font-color: #dbdbdb;' +
      '--white: white;' +
      '--black-cow: #484848;' +
      '--bluish-purple: #6b37ff;' +
      '--black: black;' +
      '--font-family: Inter, sans-serif;' +
      '}' +

            /* Required structure / click layers */
      '.creto-inline-menu-root {' +
      'position: relative;' +
      'z-index: 50;' +
      'width: 100%;' +
      'pointer-events: auto;' +
      'font-family: Inter, sans-serif;' +
      '}' +

      '.creto-inline-menu-root .header-one {' +
      'position: relative !important;' +
      'inset: auto !important;' +
      'z-index: 50 !important;' +
      'width: 100% !important;' +
      'pointer-events: auto !important;' +
      'background: #ffffff !important;' +
      '}' +

      '.creto-inline-menu-root .header-outer-wrapper {' +
      'position: relative !important;' +
      'z-index: 1000002 !important;' +
      'pointer-events: auto !important;' +
      'border-bottom: 1px solid #484848 !important;' +
      '}' +

      '.creto-inline-menu-root .header-one-main {' +
      'pointer-events: auto !important;' +
      '}' +

      '.creto-inline-menu-root .header-one-hamburger,' +
      '.creto-inline-menu-root .nav-call-button,' +
      '.creto-inline-menu-root .header-one-brand-logo {' +
      'pointer-events: auto !important;' +
      '}' +

      '.creto-inline-menu-root .header-mega-menu-outer-wrapper {' +
      'position: relative !important;' +
      'inset: auto !important;' +
      'width: 100% !important;' +
      'z-index: 10 !important;' +
      'overflow: hidden !important;' +
      'pointer-events: none;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .header-mega-menu-outer-wrapper {' +
      'pointer-events: auto !important;' +
      '}' +

      '.creto-inline-menu-root .header-cart-icon,' +
      '.creto-inline-menu-root .w-commerce-commercecartwrapper,' +
      '.creto-inline-menu-root .cart-button,' +
      '.creto-inline-menu-root .w-commerce-commercecartcontainerwrapper,' +
      '.creto-inline-menu-root .floating-popup,' +
      '.creto-inline-menu-root .similar-panel,' +
      '.creto-inline-menu-root .wand-tooltip {' +
      'display: none !important;' +
      'visibility: hidden !important;' +
      'pointer-events: none !important;' +
      'width: 0 !important;' +
      'height: 0 !important;' +
      'overflow: hidden !important;' +
      '}' +

      '.creto-inline-menu-root .dropdown-menu-list {' +
      'overflow: hidden !important;' +
      'transition: height 0.35s cubic-bezier(0.22, 1, 0.36, 1);' +
      '}' +

      '.creto-inline-menu-root .menu-vertical-line {' +
      'transition: transform 0.28s ease;' +
      '}' +

      /* Header bar only: closed = white */
      '.creto-inline-menu-root .header-outer-wrapper,' +
      '.creto-inline-menu-root .header-one-main,' +
      '.creto-inline-menu-root .header-menu-bar-main {' +
      'background: #ffffff !important;' +
      'background-color: #ffffff !important;' +
      'background-image: none !important;' +
      'color: #070707 !important;' +
      'box-shadow: 0 18px 60px rgba(0, 0, 0, 0.08) !important;' +
      'border: 1px solid rgba(0, 0, 0, 0.08) !important;' +
      'backdrop-filter: none !important;' +
      '-webkit-backdrop-filter: none !important;' +
      'transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease !important;' +
      '}' +

      '.creto-inline-menu-root .header-one-brand-logo {' +
      'display: inline-flex !important;' +
      'align-items: center !important;' +
      'opacity: 1 !important;' +
      'visibility: visible !important;' +
      '}' +

      '.creto-inline-menu-root .header-one-brand-logo img {' +
      'display: block !important;' +
      'opacity: 1 !important;' +
      'visibility: visible !important;' +
      '}' +

      '.creto-inline-menu-root .header-outer-wrapper a,' +
      '.creto-inline-menu-root .header-outer-wrapper button,' +
      '.creto-inline-menu-root .header-outer-wrapper span,' +
      '.creto-inline-menu-root .header-outer-wrapper div,' +
      '.creto-inline-menu-root .header-menu-bar-main a,' +
      '.creto-inline-menu-root .header-menu-bar-main button,' +
      '.creto-inline-menu-root .header-menu-bar-main span,' +
      '.creto-inline-menu-root .header-menu-bar-main div,' +
      '.creto-inline-menu-root .header-one-brand-logo,' +
      '.creto-inline-menu-root .header-one-brand-logo * {' +
      'color: #070707 !important;' +
      '}' +

      '.creto-inline-menu-root .nav-call-button {' +
      'background: transparent !important;' +
      'background-color: transparent !important;' +
      'background-image: none !important;' +
      'color: #070707 !important;' +
      'border-color: rgba(7, 7, 7, 0.28) !important;' +
      'box-shadow: none !important;' +
      '}' +

      '.creto-inline-menu-root .nav-call-button *,' +
      '.creto-inline-menu-root .nav-call-button .contact-text {' +
      'color: #070707 !important;' +
      '}' +

      '.creto-inline-menu-root .nav-call-button img,' +
      '.creto-inline-menu-root .home-one-header-icon img {' +
      'filter: invert(1) !important;' +
      '}' +

      '.creto-inline-menu-root .home-one-header-icon {' +
      'background: transparent !important;' +
      'background-color: transparent !important;' +
      '}' +

    '.creto-inline-menu-root .header-one-bottom-line-text {' +
    'position: relative !important;' +
    'overflow: hidden !important;' +
    'display: inline-flex !important;' +
    'flex-direction: column !important;' +
    'gap: 4px !important;' +
    '}' +

    '.creto-inline-menu-root .nav-button-white-line {' +
    'position: relative !important;' +
    'display: block !important;' +
    'width: 100% !important;' +
    'height: 1px !important;' +
    'overflow: hidden !important;' +
    'background: rgba(7, 7, 7, 0.28) !important;' +
    '}' +

    '.creto-inline-menu-root .nav-button-black-line {' +
    'display: block !important;' +
    'width: 100% !important;' +
    'height: 1px !important;' +
    'background: #070707 !important;' +
    'will-change: transform !important;' +
    'animation-name: lkNavButtonLineAuto !important;' +
    'animation-duration: 1.65s !important;' +
    'animation-timing-function: cubic-bezier(0.76, 0, 0.24, 1) !important;' +
    'animation-iteration-count: infinite !important;' +
    'animation-fill-mode: both !important;' +
    '}' +

      '.creto-inline-menu-root .header-one-hamburger {' +
      'display: grid !important;' +
      'place-items: center !important;' +
      'width: 46px !important;' +
      'height: 46px !important;' +
      'border-radius: 999px !important;' +
      'background: #070707 !important;' +
      'cursor: pointer !important;' +
      '}' +

      '.creto-inline-menu-root .nav-dot-div {' +
      'display: grid !important;' +
      'grid-template-columns: repeat(2, 5px) !important;' +
      'grid-template-rows: repeat(2, 5px) !important;' +
      'gap: 5px !important;' +
      'align-items: center !important;' +
      'justify-items: center !important;' +
      '}' +

      '.creto-inline-menu-root .nav-dot-wrap,' +
      '.creto-inline-menu-root .nav-dot-wrap-two {' +
      'display: contents !important;' +
      '}' +

      '.creto-inline-menu-root .nav-dot-one,' +
      '.creto-inline-menu-root .nav-dot-two,' +
      '.creto-inline-menu-root .nav-dot-three,' +
      '.creto-inline-menu-root .nav-dot-four {' +
      'display: block !important;' +
      'width: 5px !important;' +
      'height: 5px !important;' +
      'min-width: 5px !important;' +
      'min-height: 5px !important;' +
      'border-radius: 999px !important;' +
      'background: #ffffff !important;' +
      'background-color: #ffffff !important;' +
      'border: 0 !important;' +
      'opacity: 1 !important;' +
      'transition: transform 0.35s ease, opacity 0.35s ease, background-color 0.35s ease !important;' +
      '}' +

      /* Header bar only: open = dark */
      '.creto-inline-menu-root[data-open="true"] .header-outer-wrapper,' +
      '.creto-inline-menu-root[data-open="true"] .header-one-main {' +
      'background: #070707 !important;' +
      'background-color: #070707 !important;' +
      'color: #ffffff !important;' +
      'border-color: transparent !important;' +
      'box-shadow: none !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .header-menu-bar-main {' +
      'background: #0707071c !important;' +
      'background-color: #0707071c !important;' +
      'background-image: none !important;' +
      'color: #ffffff !important;' +
      'border: 0 !important;' +
      'border-color: transparent !important;' +
      'box-shadow: none !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .header-outer-wrapper {' +
      'border-bottom: 1px solid #484848 !important;' +
      'box-shadow: none !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .header-outer-wrapper a,' +
      '.creto-inline-menu-root[data-open="true"] .header-outer-wrapper button,' +
      '.creto-inline-menu-root[data-open="true"] .header-outer-wrapper span,' +
      '.creto-inline-menu-root[data-open="true"] .header-outer-wrapper div,' +
      '.creto-inline-menu-root[data-open="true"] .header-menu-bar-main a,' +
      '.creto-inline-menu-root[data-open="true"] .header-menu-bar-main button,' +
      '.creto-inline-menu-root[data-open="true"] .header-menu-bar-main span,' +
      '.creto-inline-menu-root[data-open="true"] .header-menu-bar-main div,' +
      '.creto-inline-menu-root[data-open="true"] .header-one-brand-logo,' +
      '.creto-inline-menu-root[data-open="true"] .header-one-brand-logo * {' +
      'color: #ffffff !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .header-one-brand-logo img {' +
      'filter: none !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-call-button {' +
      'background: transparent !important;' +
      'background-color: transparent !important;' +
      'color: #ffffff !important;' +
      'border-color: rgba(255, 255, 255, 0.35) !important;' +
      'box-shadow: none !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-call-button *,' +
      '.creto-inline-menu-root[data-open="true"] .nav-call-button .contact-text {' +
      'color: #ffffff !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-call-button img,' +
      '.creto-inline-menu-root[data-open="true"] .home-one-header-icon img {' +
      'filter: invert(1) !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .home-one-header-icon {' +
      'background: #ffffff !important;' +
      'background-color: #ffffff !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-button-white-line {' +
      'background: rgba(0, 0, 0, 0.22) !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-button-black-line {' +
      'background: #ffffff !important;' +
      'animation-name: lkNavButtonLineAuto !important;' +
      'animation-duration: 1.65s !important;' +
      'animation-timing-function: cubic-bezier(0.76, 0, 0.24, 1) !important;' +
      'animation-iteration-count: infinite !important;' +
      'animation-fill-mode: both !important;' +
      '}' +
      
      '.creto-inline-menu-root[data-open="true"] .outline {' +
      'border-color: rgba(255, 255, 255, 0.16) !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .header-one-hamburger {' +
      'background: #ffffff !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-dot-one,' +
      '.creto-inline-menu-root[data-open="true"] .nav-dot-two,' +
      '.creto-inline-menu-root[data-open="true"] .nav-dot-three,' +
      '.creto-inline-menu-root[data-open="true"] .nav-dot-four {' +
      'background: #070707 !important;' +
      'background-color: #070707 !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-dot-one {' +
      'transform: translate(5px, 5px) rotate(45deg) scaleX(2.4) !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-dot-two,' +
      '.creto-inline-menu-root[data-open="true"] .nav-dot-three {' +
      'opacity: 0 !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-dot-four {' +
      'transform: translate(-5px, -5px) rotate(-45deg) scaleX(2.4) !important;' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .nav-call-button img,' +
      '.creto-inline-menu-root[data-open="true"] .home-one-header-icon img {' +
      'filter: invert(1) !important;' +
      '}' +

       '.creto-desktop-skills {' +
      'position: relative;' +
      'z-index: 3;' +
      'display: flex;' +
      'gap: 12px;' +
      'align-items: center;' +
      'justify-content: center;' +
      'width: 100%;' +
      'margin: 14px auto 22px;' +
      'padding: 0 24px;' +
      'transform: none;' +
      'pointer-events: none;' +
      '}' +

      '@property --lk-glass-angle-1 {' +
        'syntax: "<angle>";' +
        'inherits: false;' +
        'initial-value: -75deg;' +
        '}' +

        '@property --lk-glass-angle-2 {' +
        'syntax: "<angle>";' +
        'inherits: false;' +
        'initial-value: -45deg;' +
        '}' +

        '.creto-inline-menu-root {' +
        '--lk-glass-hover-time: 400ms;' +
        '--lk-glass-hover-ease: cubic-bezier(0.25, 1, 0.5, 1);' +
        '}' +

        '.lk-glass-button-wrap,' +
        '.creto-desktop-skill {' +
        'position: relative;' +
        'z-index: 2;' +
        'display: inline-flex;' +
        'font-size: 15px;' +
        'align-items: center;' +
        'justify-content: center;' +
        'border-radius: 999vw;' +
        'background: transparent;' +
        'pointer-events: none;' +
        'transition: all var(--lk-glass-hover-time) var(--lk-glass-hover-ease);' +
        '}' +

        '.lk-glass-button-shadow {' +
        '--shadow-cuttoff-fix: 2em;' +
        'position: absolute;' +
        'width: calc(100% + var(--shadow-cuttoff-fix));' +
        'height: calc(100% + var(--shadow-cuttoff-fix));' +
        'top: calc(0% - var(--shadow-cuttoff-fix) / 2);' +
        'left: calc(0% - var(--shadow-cuttoff-fix) / 2);' +
        'filter: blur(clamp(2px, 0.125em, 12px));' +
        'overflow: visible;' +
        'pointer-events: none;' +
        '}' +

        '.lk-glass-button-shadow::after {' +
        'content: "";' +
        'position: absolute;' +
        'z-index: 0;' +
        'inset: 0;' +
        'border-radius: 999vw;' +
        'background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));' +
        'width: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);' +
        'height: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);' +
        'top: calc(var(--shadow-cuttoff-fix) - 0.5em);' +
        'left: calc(var(--shadow-cuttoff-fix) - 0.875em);' +
        'padding: 0.125em;' +
        'box-sizing: border-box;' +
        'mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);' +
        'mask-composite: exclude;' +
        'transition: all var(--lk-glass-hover-time) var(--lk-glass-hover-ease);' +
        'overflow: visible;' +
        'opacity: 1;' +
        '}' +

        '.lk-glass-button {' +
        '--border-width: clamp(1px, 0.0625em, 4px);' +
        'all: unset;' +
        'cursor: pointer;' +
        'position: relative;' +
        'z-index: 3;' +
        'display: inline-flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'box-sizing: border-box;' +
        'border-radius: 999vw !important;' +
        'background: linear-gradient(-75deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)) !important;' +
        'box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05), inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5), 0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.2), 0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2), 0 0 0 0 rgba(255, 255, 255, 1) !important;' +
        'backdrop-filter: blur(clamp(1px, 0.125em, 4px));' +
        '-webkit-backdrop-filter: blur(clamp(1px, 0.125em, 4px));' +
        'transition: all var(--lk-glass-hover-time) var(--lk-glass-hover-ease);' +
        'pointer-events: auto;' +
        'text-decoration: none !important;' +
        '}' +

        '.lk-glass-button span {' +
        'position: relative;' +
        'z-index: 4;' +
        'display: block;' +
        'user-select: none;' +
        '-webkit-user-select: none;' +
        'font-family: Inter, sans-serif;' +
        'letter-spacing: -0.05em;' +
        'font-weight: 500;' +
        'font-size: 1em;' +
        'line-height: 1;' +
        'color: rgba(50, 50, 50, 1) !important;' +
        '-webkit-font-smoothing: antialiased;' +
        '-moz-osx-font-smoothing: grayscale;' +
        'text-shadow: 0em 0.25em 0.05em rgba(0, 0, 0, 0.1) !important;' +
        'transition: all var(--lk-glass-hover-time) var(--lk-glass-hover-ease);' +
        'padding-inline: 1.5em;' +
        'padding-block: 0.875em;' +
        'white-space: nowrap;' +
        '}' +

        '.lk-glass-button:hover span {' +
          'text-shadow: 0.025em 0.025em 0.025em rgba(0, 0, 0, 0.12) !important;' +
        '}' +

        '.lk-glass-button span::after,' +
        'content: "";' +
        'display: block;' +
        'position: absolute;' +
        'z-index: 1;' +
        'width: calc(100% - var(--border-width));' +
        'height: calc(100% - var(--border-width));' +
        'top: calc(0% + var(--border-width) / 2);' +
        'left: calc(0% + var(--border-width) / 2);' +
        'box-sizing: border-box;' +
        'border-radius: 999vw;' +
        'overflow: clip;' +
        'background: linear-gradient(var(--lk-glass-angle-2), rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 40% 50%, rgba(255, 255, 255, 0) 55%);' +
        'mix-blend-mode: screen;' +
        'pointer-events: none;' +
        'background-size: 200% 200%;' +
        'background-position: 0% 50%;' +
        'background-repeat: no-repeat;' +
        'transition: background-position calc(var(--lk-glass-hover-time) * 1.25) var(--lk-glass-hover-ease), --lk-glass-angle-2 calc(var(--lk-glass-hover-time) * 1.25) var(--lk-glass-hover-ease);' +
        '}' +

        '.lk-glass-button::after,' +
        'content: "";' +
        'position: absolute;' +
        'z-index: 1;' +
        'inset: 0;' +
        'border-radius: 999vw;' +
        'width: calc(100% + var(--border-width));' +
        'height: calc(100% + var(--border-width));' +
        'top: calc(0% - var(--border-width) / 2);' +
        'left: calc(0% - var(--border-width) / 2);' +
        'padding: var(--border-width);' +
        'box-sizing: border-box;' +
        'background: conic-gradient(from var(--lk-glass-angle-1) at 50% 50%, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) 5% 40%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 60% 95%, rgba(0, 0, 0, 0.5)), linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));' +
        'mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);' +
        'mask-composite: exclude;' +
        'transition: all var(--lk-glass-hover-time) var(--lk-glass-hover-ease), --lk-glass-angle-1 500ms ease;' +
        'box-shadow: inset 0 0 0 calc(var(--border-width) / 2) rgba(255, 255, 255, 0.5);' +
        'pointer-events: none;' +
        '}' +

        '.lk-glass-button:hover,' +
        'transform: scale(0.975);' +
        'backdrop-filter: blur(0.01em);' +
        '-webkit-backdrop-filter: blur(0.01em);' +
        'box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05), inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5), 0 0.15em 0.05em -0.1em rgba(0, 0, 0, 0.25), 0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.5), 0 0 0 0 rgba(255, 255, 255, 1) !important;' +
        '}' +

        '.lk-glass-button:hover span::after,' +
        'background-position: 25% 50%;' +
        '}' +

        '.lk-glass-button:hover::after,' +
        '--lk-glass-angle-1: -125deg;' +
        '}' +

        '.lk-glass-button:active::after,' +
        '--lk-glass-angle-1: -75deg;' +
        '}' +

        '.lk-glass-button:active span::after,' +
        'background-position: 50% 15%;' +
        '--lk-glass-angle-2: -15deg;' +
        '}' +

        '.lk-glass-button-wrap:has(.lk-glass-button:hover) .lk-glass-button-shadow {' +
        'filter: blur(clamp(2px, 0.0625em, 6px));' +
        'transition: filter var(--lk-glass-hover-time) var(--lk-glass-hover-ease);' +
        '}' +

        '.lk-glass-button-wrap:has(.lk-glass-button:hover) .lk-glass-button-shadow::after {' +
        'top: calc(var(--shadow-cuttoff-fix) - 0.875em);' +
        'opacity: 1;' +
        '}' +

        '.lk-glass-button-wrap:has(.lk-glass-button:active) {' +
        'transform: rotate3d(1, 0, 0, 25deg);' +
        '}' +

        '.lk-glass-button-wrap:has(.lk-glass-button:active) .lk-glass-button-shadow {' +
        'filter: blur(clamp(2px, 0.125em, 12px));' +
        '}' +

        '.lk-glass-button-wrap:has(.lk-glass-button:active) .lk-glass-button-shadow::after {' +
        'top: calc(var(--shadow-cuttoff-fix) - 0.5em);' +
        'opacity: 0.75;' +
        '}' +

        '@media (hover: none) and (pointer: coarse) {' +
        '.lk-glass-button span::after,' +
        '.lk-glass-button:active span::after {' +
        '--lk-glass-angle-2: -45deg;' +
        '}' +
        '.lk-glass-button::after,' +
        '.lk-glass-button:hover::after,' +
        '.lk-glass-button:active::after {' +
        '--lk-glass-angle-1: -75deg;' +
        '}' +
        '}' +


      '.creto-inline-menu-root .menu-background-text-marque {' +
      'overflow: hidden !important;' +
      'white-space: nowrap !important;' +
      'pointer-events: none !important;' +
      '}' +

      '.creto-inline-menu-root .menu-background-text-marque .marque-train,' +
      '.creto-inline-menu-root .menu-background-text-marque .marque-slow-train {' +
      'display: flex !important;' +
      'width: max-content !important;' +
      'white-space: nowrap !important;' +
      'will-change: transform !important;' +
      'animation: cretoLeonMarquee 22s linear infinite !important;' +
      '}' +

      '.creto-inline-menu-root .header-menu-bar-background-text {' +
      'white-space: nowrap !important;' +
      'will-change: transform !important;' +
      '}' +

      '@keyframes cretoLeonMarquee {' +
      'from { transform: translate3d(0, 0, 0); }' +
      'to { transform: translate3d(-50%, 0, 0); }' +
      '}' +

      '.creto-inline-menu-root[data-open="true"] .creto-desktop-skills {' +
      'display: none !important;' +
      '}' +

       /* Header sizing/layout fixes */
      '.creto-inline-menu-root .main-container.overflow-visible {' +
      'background: #ffffff !important;' +
      'background-color: #ffffff !important;' +
      'margin: 0 auto !important;' +
      'padding: 0 !important;' +
      'min-width: 100% !important;' +
      'max-width: 100% !important;' +
      'width: 100% !important;' +
      'box-sizing: border-box !important;' +
      '}' +

      '.creto-inline-menu-root .header-one-main {' +
      'padding-left: 5rem !important;' +
      'padding-right: 5rem !important;' +
      'box-sizing: border-box !important;' +
      '}' +

      '.creto-inline-menu-root .header-outer-wrapper {' +
      'background: #ffffff !important;' +
      'background-color: #ffffff !important;' +
      'padding: 0 !important;' +
      'border-bottom: 1px solid #484848 !important;' +
      'box-sizing: border-box !important;' +
      '}' +

      '@media (max-width: 1199px) {' +
      '.creto-inline-menu-root .header-one-main {' +
      'padding-left: 2rem !important;' +
      'padding-right: 2rem !important;' +
      '}' +
      '}' +

      '@media (max-width: 991px) {' +
      '.creto-inline-menu-root .header-one-main {' +
      'padding-left: 1rem !important;' +
      'padding-right: 1rem !important;' +
      '}' +
      '}' +

      '@keyframes lkNavButtonLineAuto {' +
      '0% { transform: translate3d(-105%, 0, 0); }' +
      '42% { transform: translate3d(0%, 0, 0); }' +
      '58% { transform: translate3d(0%, 0, 0); }' +
      '100% { transform: translate3d(105%, 0, 0); }' +
      '}' +

            '.creto-inline-menu-root .lk-brand-text {' +
      'display: inline-flex !important;' +
      'align-items: baseline !important;' +
      'white-space: nowrap !important;' +
      'overflow: visible !important;' +
      'line-height: 1 !important;' +
      'letter-spacing: -0.035em !important;' +
      '}' +

      '.creto-inline-menu-root .lk-brand-letter-mask {' +
      'display: inline-block !important;' +
      'overflow: hidden !important;' +
      'line-height: 1.08 !important;' +
      'vertical-align: baseline !important;' +
      '}' +

      '.creto-inline-menu-root .lk-brand-letter {' +
      'display: inline-block !important;' +
      'opacity: 0;' +
      'transform: translate3d(0, 115%, 0) rotate(7deg);' +
      'transform-origin: 50% 100%;' +
      'will-change: transform, opacity;' +
      '}' +

      '.creto-inline-menu-root .lk-brand-space {' +
      'display: inline-block !important;' +
      'width: 0.34em !important;' +
      '}' +

      '@keyframes lkBrandLetterReveal {' +
      '0% {' +
      'opacity: 0;' +
      'transform: translate3d(0, 115%, 0) rotate(7deg);' +
      '}' +
      '65% {' +
      'opacity: 1;' +
      'transform: translate3d(0, -8%, 0) rotate(0deg);' +
      '}' +
      '100% {' +
      'opacity: 1;' +
      'transform: translate3d(0, 0, 0) rotate(0deg);' +
      '}' +
      '}' +

       

      '.creto-inline-menu-root .menu-background-radial,' +
      '.menu-background-radial {' +
      '  background-color: #00000d !important;' +
      '  background-image:' +
      '    radial-gradient(circle at 71% 63%, #3780ff70 0%, transparent 30%),' +
      '    radial-gradient(circle at 27% 43%, #3c42ff8a 0%, transparent 25%) !important;' +
      '}' +

      '.creto-inline-menu-root .dropdown-menu-list {' +
      'display: grid !important;' +
      'gap: 10px !important;' +
      'padding-top: 12px !important;' +
      'overflow: hidden !important;' +
      'transition: height 0.42s cubic-bezier(0.22, 1, 0.36, 1) !important;' +
      '}' +


'.creto-inline-menu-root .dropdown-menu-list {' +
'display: grid !important;' +
'gap: 14px !important;' +
'padding-top: 18px !important;' +
'overflow: hidden !important;' +
'transition: height 0.42s cubic-bezier(0.22, 1, 0.36, 1) !important;' +
'}' +

'.creto-inline-menu-root .dropdown-menu-link {' +
'display: block !important;' +
'color: rgba(255,255,255,0.78) !important;' +
'font-size: clamp(18px, 1.45vw, 24px) !important;' +
'font-weight: 600 !important;' +
'line-height: 1.12 !important;' +
'text-decoration: none !important;' +
'padding: 2px 0 !important;' +
'}' +

'.creto-inline-menu-root .dropdown-menu-link:hover {' +
'color: #ffffff !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal {' +
'position: fixed !important;' +
'inset: 0 !important;' +
'z-index: 9999999 !important;' +
'display: flex !important;' +
'align-items: center !important;' +
'justify-content: center !important;' +
'padding: clamp(20px, 4vw, 64px) !important;' +
'opacity: 0 !important;' +
'pointer-events: none !important;' +
'transform: translate3d(0px, 18px, 0px) scale(0.96) !important;' +
'transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-backdrop {' +
'position: absolute !important;' +
'inset: 0 !important;' +
'background: rgba(0, 0, 0, 0.58) !important;' +
'backdrop-filter: blur(18px) saturate(130%) !important;' +
'-webkit-backdrop-filter: blur(18px) saturate(130%) !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-panel {' +
'position: relative !important;' +
'z-index: 2 !important;' +
'width: min(92vw, 1040px) !important;' +
'max-height: min(82vh, 760px) !important;' +
'overflow: auto !important;' +
'border: 1px solid rgba(255,255,255,0.16) !important;' +
'border-radius: 28px !important;' +
'background: linear-gradient(135deg, rgba(9, 10, 28, 0.92), rgba(22, 38, 75, 0.86)) !important;' +
'box-shadow: 0 40px 120px rgba(0,0,0,0.46) !important;' +
'padding: clamp(28px, 4vw, 54px) !important;' +
'color: #ffffff !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-panel .leon-menu-projects-modal-close {' +
'display: inline-flex !important;' +
'align-items: center !important;' +
'justify-content: center !important;' +
'width: 56px !important;' +
'height: 56px !important;' +
'padding: 0 !important;' +
'border-radius: 999px !important;' +
'background: #000000 !important;' +
'background-color: #000000 !important;' +
'border: 1px solid rgba(255, 255, 255, 0.18) !important;' +
'color: #ffffff !important;' +
'font-size: 0 !important;' +
'line-height: 1 !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-panel .leon-menu-projects-modal-close::before {' +
'content: "×" !important;' +
'display: flex !important;' +
'align-items: center !important;' +
'justify-content: center !important;' +
'width: 100% !important;' +
'height: 100% !important;' +
'color: #ffffff !important;' +
'font-size: 34px !important;' +
'font-weight: 700 !important;' +
'line-height: 1 !important;' +
'transform: translateY(-1px) !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-kicker {' +
'font-size: 14px !important;' +
'font-weight: 700 !important;' +
'letter-spacing: 0.08em !important;' +
'text-transform: uppercase !important;' +
'opacity: 0.66 !important;' +
'margin-bottom: 10px !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-title {' +
'margin: 0 0 28px !important;' +
'font-size: clamp(42px, 5vw, 82px) !important;' +
'line-height: 0.9 !important;' +
'letter-spacing: -0.07em !important;' +
'color: #ffffff !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-grid {' +
'display: grid !important;' +
'grid-template-columns: repeat(2, minmax(0, 1fr)) !important;' +
'gap: 12px 22px !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-link {' +
'display: flex !important;' +
'align-items: baseline !important;' +
'gap: 14px !important;' +
'padding: 14px 0 !important;' +
'border-bottom: 1px solid rgba(255,255,255,0.12) !important;' +
'color: rgba(255,255,255,0.82) !important;' +
'text-decoration: none !important;' +
'font-size: clamp(20px, 2vw, 32px) !important;' +
'font-weight: 700 !important;' +
'line-height: 1.08 !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-link:hover {' +
'color: #ffffff !important;' +
'}' +

'.creto-inline-menu-root .leon-menu-projects-modal-number {' +
'font-size: 13px !important;' +
'font-weight: 800 !important;' +
'opacity: 0.46 !important;' +
'min-width: 28px !important;' +
'}' +

'@media (max-width: 767px) {' +
'.creto-inline-menu-root .leon-menu-projects-modal-grid {' +
'grid-template-columns: 1fr !important;' +
'}' +
'.creto-inline-menu-root .leon-menu-projects-modal-panel {' +
'max-height: 86vh !important;' +
'border-radius: 22px !important;' +
'}' +
'}' +

'.creto-inline-menu-root .lk-linkedin-mini-icon {' +
'display: inline-flex !important;' +
'align-items: center !important;' +
'justify-content: center !important;' +
'width: 18px !important;' +
'height: 18px !important;' +
'border-radius: 3px !important;' +
'background: #ffffff !important;' +
'color: #111111 !important;' +
'font-size: 12px !important;' +
'font-weight: 900 !important;' +
'line-height: 1 !important;' +
'margin-right: 8px !important;' +
'}' +

'.creto-inline-menu-root .lk-linkedin-social-card {' +
'display: inline-flex !important;' +
'align-items: center !important;' +
'gap: 10px !important;' +
'color: #ffffff !important;' +
'text-decoration: none !important;' +
'}' +

'.creto-inline-menu-root .lk-linkedin-social-icon {' +
'display: block !important;' +
'width: 18px !important;' +
'height: 18px !important;' +
'min-width: 18px !important;' +
'color: #ffffff !important;' +
'fill: currentColor !important;' +
'}' +


'.creto-inline-menu-root .lk-brand-lockup {' +
'display: inline-flex !important;' +
'align-items: center !important;' +
'gap: 10px !important;' +
'}' +

'.creto-inline-menu-root .lk-brand-logo-img {' +
'display: block !important;' +
'width: 64px !important;' +
'height: 64px !important;' +
'min-width: 64px !important;' +
'object-fit: contain !important;' +
'opacity: 1 !important;' +
'transform: scale(1) rotate(0deg) !important;' +
'filter: blur(0) saturate(1) !important;' +
'transition: opacity 520ms ease, transform 720ms cubic-bezier(0.22, 1, 0.36, 1), filter 520ms ease !important;' +
'}' +

'.creto-inline-menu-root .lk-brand-logo-img.is-logo-fading {' +
'opacity: 0 !important;' +
'transform: scale(0.94) rotate(-2deg) !important;' +
'filter: blur(2px) saturate(0.85) !important;' +
'}' +

'.creto-inline-menu-root .lk-brand-logo-img.is-colored-logo {' +
'opacity: 1 !important;' +
'transform: scale(1.04) rotate(0deg) !important;' +
'filter: blur(0) saturate(1.12) !important;' +
'}' +

'.creto-inline-menu-root .lk-brand-logo-img {' +
'display: block !important;' +
'width: 64px !important;' +
'height: 64px !important;' +
'object-fit: contain !important;' +
'}' +

'.creto-inline-menu-root .lk-brand-logo-img.is-colored-logo {' +
'transform: scale(1.02) !important;' +
'}' +


      '</style>' +
      '<div class="creto-inline-menu-root">' +
      cretoHeaderHtml +
      '<div class="creto-desktop-skills" aria-label="Core skills">' +
      desktopSkillsHtml +
      '</div>' +
      '</div>';

    const root = shadow.querySelector<HTMLElement>(".creto-inline-menu-root");

    if (!root) return;

    const hamburger = root.querySelector<HTMLElement>(".header-one-hamburger");
    const menu = root.querySelector<HTMLElement>(".header-mega-menu-outer-wrapper");

    if (!hamburger || !menu) return;

    root.dataset.open = "false";
    menu.style.height = "0vh";
    menu.style.pointerEvents = "none";
    menu.style.overflow = "hidden";

    restartNavButtonLine(root);
    replayBrandLogo(root);
    
    root.querySelectorAll<HTMLElement>(
      ".menu-list, .menu-get-in-touch-heading, .menu-get-in-touch-contact-card, .menu-social-links-heading, .menu-social-link, .menu-social-link-item, .menu-social-link-card, .menu-creto-text, .marque-slow-train",
    )
      .forEach((item) => {
        setTranslateY(item, "110%");
      });

    const handleToggle = () => {
      const isOpen = root.dataset.open === "true";

      if (isOpen) {
        closeMenu(root);
      } else {
        openMenu(root);
      }
    };

    hamburger.addEventListener("click", handleToggle);
    syncCretoMenuContent(root);
    setupDropdowns(root);
    setupInternalLinks(root);
    const cleanupAboutMenuRoute = setupAboutMenuRoute(shadow);

    
    let lastScrollY = window.scrollY;
    let hasLeftTopArea = window.scrollY > 220;

    const handleBrandReplayOnScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      if (currentScrollY > 220) {
        hasLeftTopArea = true;
      }

      if (isScrollingUp && currentScrollY <= 80 && hasLeftTopArea) {
        hasLeftTopArea = false;
        replayBrandLogo(root);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleBrandReplayOnScroll, {
      passive: true,
    });    

    return () => {
      hamburger.removeEventListener("click", handleToggle);
      window.removeEventListener("scroll", handleBrandReplayOnScroll);
      cleanupAboutMenuRoute();
      document.documentElement.classList.remove("creto-menu-open");
      shadow.innerHTML = "";
    };
  }, []);

  return <div ref={hostRef} className="creto-menu-shadow-host" />;
}
